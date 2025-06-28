import os
from typing import Optional, List

from datetime import date
from typing_extensions import Annotated
from bson import ObjectId

from fastapi import FastAPI, Body, HTTPException, status
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ConfigDict, BaseModel, Field, BeforeValidator
from pymongo import ReturnDocument, AsyncMongoClient


app = FastAPI(
    title="Entries API",
    summary="FastAPI ReST API with MongoDB.",
)

origins = [
    "http://localhost:5173",
    "http://0.0.0.0:5173",
    "http://0.0.0.0",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncMongoClient(os.environ["MONGODB_URL"])
db = client.default_db
note_collection = db.get_collection("default_db_collection")

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]



class HealthCheck(BaseModel):
    """
    Container for generic text.
    """
    response: str = "health check ok"    

 
@app.get(
    "/health",
    tags=["healthcheck"],
    summary="Perform a Health Check",
    response_description="Return HTTP Status Code 200 (OK)",
    status_code=status.HTTP_200_OK,
    response_model=HealthCheck,
)
def get_health() -> HealthCheck:
    """
    ## Perform a Health Check
    Endpoint to perform a healthcheck on. This endpoint can primarily be used Docker
    to ensure a robust container orchestration and management is in place. Other
    services which rely on proper functioning of the API service will not deploy if this
    endpoint returns any other HTTP status code except 200 (OK).
    Returns:
        HealthCheck: Returns a JSON response with the health status
    """
    return HealthCheck(status="OK")


class NoteModel(BaseModel):
    """
    Container for a single note.
    """

    # The primary key for the NoteModel, stored as a `str` on the instance.
    # This will be aliased to `_id` when sent to MongoDB,
    # but provided as `id` in the API requests and responses.
    #  id: "4",
    #  title: "test note 2",
    #  content: "some text here",
    #  created_date: "February 8, 2024"
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str = Field(...)
    content: str = Field(...)
    #created_date: date = Field(...)
    created_date: str = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "title": "note title/headline",
                "content": "this is the content of a note",
                "created_date": "2024-02-08"
            }
        },
    )
    # @computed_field
    # @property
    # def timestamp(self) -> datetime.datetime:
    #     return datetime.datetime.combine(self.date, self.time)


class UpdateNoteModel(BaseModel):
    """
    A set of optional updates to be made to a document in the database.
    """

    title: Optional[str] = None
    content: Optional[str] = None
    created_date: Optional[str] = None
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "title": "note title/headline",
                "content": "this is the content of a note",
                "created_date": "2024-02-08"
            }
        },
    )


class NoteCollection(BaseModel):
    """
    A container holding a list of `NoteModel` instances.

    This exists because providing a top-level array in a JSON response can be a [vulnerability](https://haacked.com/archive/2009/06/25/json-hijacking.aspx/)
    """
    # note_collection_id: "1",
    # grouping: "yearly",
    # year: "2025",
    # notes: [
    notes: List[NoteModel]


@app.post(
    "/notes/",
    response_description="Add new note",
    response_model=NoteModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_note(note: NoteModel = Body(...)):
    """
    Insert a new note record.

    A unique `id` will be created and provided in the response.
    """
    new_note = await note_collection.insert_one(
        note.model_dump(by_alias=True, exclude=["id"])
    )
    created_note = await note_collection.find_one(
        {"_id": new_note.inserted_id}
    )
    return created_note


@app.get(
    "/notes/",
    response_description="List all notes",
    response_model=NoteCollection,
    response_model_by_alias=False,
)
async def list_notes():
    """
    List all of the notes in the database.

    The response is unpaginated and limited to 1000 results.
    """
    return NoteCollection(notes=await note_collection.find().to_list(1000))


@app.get(
    "/notes/{id}",
    response_description="Get a single note",
    response_model=NoteModel,
    response_model_by_alias=False,
)
async def show_note(id: str):
    """
    Get the record for a specific note, looked up by `id`.
    """
    if (
        note := await note_collection.find_one({"_id": ObjectId(id)})
    ) is not None:
        return note

    raise HTTPException(status_code=404, detail=f"Note {id} not found")


@app.put(
    "/notes/{id}",
    response_description="Update a note",
    response_model=NoteModel,
    response_model_by_alias=False,
)
async def update_note(id: str, note: UpdateNoteModel = Body(...)):
    """
    Update individual fields of an existing note record.

    Only the provided fields will be updated.
    Any missing or `null` fields will be ignored.
    """
    note = {
        k: v for k, v in note.model_dump(by_alias=True).items() if v is not None
    }

    if len(note) >= 1:
        update_result = await note_collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": note},
            return_document=ReturnDocument.AFTER,
        )
        if update_result is not None:
            return update_result
        else:
            raise HTTPException(status_code=404, detail=f"Note {id} not found")

    # The update is empty, but we should still return the matching document:
    if (existing_note := await note_collection.find_one({"_id": id})) is not None:
        return existing_note

    raise HTTPException(status_code=404, detail=f"Note {id} not found")


@app.delete("/notes/{id}", response_description="Delete a note")
async def delete_note(id: str):
    """
    Remove a single note record from the database.
    """
    delete_result = await note_collection.delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"Note {id} not found")