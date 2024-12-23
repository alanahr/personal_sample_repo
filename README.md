# Sample Repo/Personal Project

## Intro
This is an updated version of a project I've been working on for *years*. Any time I had an idea, I just threw it in without worrying about it being perfect, thus it's not public. However, after years of working on it, I want to start fresh and pare it down to the things that are a) (still) important, and b) things that aren't possible with an already existing solution *or* things that are possible but I'd have to pay so it'd be worth it to self-host.

### The old repo
The old repo had so many features, like...
- (Home) inventory management (basic CRUD stuff)
- File ingestion/exploration/reformatting
- Spotify API interactions
- SMS parsing, sentiment analysis, etc. (from .xml)
- Exercise/workout management (CRUD operations for all, exercises with alternate names and related exercises, and then workout management with time- or count-based sets)
- *Very* basic Garmin/workout file ingestion & display (.tcx and .xml)
- and more...

And all this required the usage of a _lot_ of libraries like rrule (and pytz and other calendar/time-related libraries), SQLAlchemy, requests, nltk (for text analysis), plotly (for visualization), selenium (for browser automation/testing), ssh + paramiko (for connecting to external resources, tunnels, etc.), networkx (for graphs), beautiful soup (for saving/parsing html), pandas + numpy and related for working with various data formats, grouping, etc., celery for long-running/async jobs, etc. It got out of hand. I also worked with .json, .txt, .xml, .csv, and .xlsx files amongst others. I also had some jupyter notebooks in there, sphinx docs, some terraform, etc... 


## Tool Features
### Manage a generic set of "entries" with multiple relationships
I want to manage generic goals along with implementation and measurements (e.g., SMART goals, goals > habits/tasks with due date, etc.)

I also tend to keep track of a lot of personal projects, chores, maintenance tasks, lists, etc., and sometimes these things are related or one can be dependent on another. For example, if I have a task to caulk and I'm out of caulk, I need to make sure that buying caulk is on a list *first* (and the task depends on that being completed first) and it's appropriately assigned to a home improvement store shopping list).

### Quill/CKEditor WYSIWYG editor for daily ad hoc notes, auto tagging with related entries, notes, and sentiments, and multiple document layouts
One of the biggest things I want to do is write notes, but instead of having to navigate to individual documents/parents, I want to be able to start with a parent document, and then reassign those blocks as needed later.
Secondly, one of the things with keeping a journal is remembering how things actually were in the moment as over time we tend to forget how we actually felt and nostalgia makes us remember things better than they actually were. I want to track my sentiments as I go though when I wrote notes I tend to write sentiment-related words as I go. I also think there's a big opportunity here for context-aware suggestions (e.g., relations to entries/goals, adding tasks, maybe even auto topic detection. We'll see how far I get, though.


### Forms, Duplicate Detection, and Smart Typeahead/Autocomplete
One of the main features lacking from any tool out there is just a simple typeahead/autocomplete showing existing items and the ability to *remember* past items entered and automatically categorize them or tag them like previously entered ones.

I also want to make smart forms without paying extra (e.g., if I select A from dropdown one, dropdown two automatically shows X, Y, and Z.

There are a lot of instances in which I write down the same stuff over and over on a shopping list, however, some stuff tends to need to go to the top of the list when I notice it (e.g., soap), while other stuff can be a monthly/future sort of thing. The same thing applies to chores/tasks. 

## Implementation Features
### Build/Deploy/CI/CD, etc.
Things I'm planning on using are Docker (still) but moving to GitHub for CI/CD.

### UI
I was using Jinja and writing a lot of js as I went, so this time I'm going to move to Vue + Vite (and PrimeVue, Apollo, etc.)

### Server
Still thinking about a separate Flask+Jinja server and a dedicated API server, but we'll see.

### Data storage
I've used mostly MySQL and PostgreSQL, but given the complicated structures I end up creating, I'm planning on moving to MongoDB.

## Guiding Principles
☐ clean  up this section
Design is guided (loosely) by the [12 factor principles](https://12factor.net/) and the [EKS workshop version](https://developers.eksworkshop.com/docs/introduction/python/refactoring/) and the [Google version](https://cloud.google.com/architecture/twelve-factor-app-development-on-gcp), etc. <sup>1</sup> + 3 more
1. **codebase** - One codebase tracked in **revision control**, many deploys
   - ideally within this are requirements and use cases, stories, tests, etc. 
   - using git
     - create repo on [github](https://www.atlassian.com/git/tutorials) and/or locally
2. explicitly declare and isolate **dependencies**
   - regularly upgrade and check versions
3. store the config in the env (and secrets) - **env config not in code** - and should have configs for the various environments
   - retrieve any external data API agreements/developer terms
4. backing resources are attached services (also see CI/CD)
   - A backing service is any service the app consumes over the network as part of its normal operation like databases, caches, messaging/queueing systems, etc. They should be attachable and detachable at will and should not be tied to the app being up/down. Code changes should not be required to attach/detach services. Therefore... 
     - blue green/rolling deployment (also see next bullet point)
     - keep restorable database backups, migrations, streaming replication, etc.
5. separate build, release, and run stages (also see CI/CD) to enable rollback, version tracking, etc.
  * build the code into a bundle with a set version (keep release notes)
  * use the config per the env and combine with bundle from above step 
  * run it
6. speaking of running it, the app should be stateless, that is any running services should not share state, memory, etc. (SN). If state is shared, there can be a single point of failure. Anything data that needs to persist must be stored in a stateful backing service (e.g., a database)
7. export services via (port) binding
8. design/develop and scale out via the process model - **concurrency**  [see reference](https://adam.herokuapp.com/past/2011/5/9/applying_the_unix_process_model_to_web_apps/)
  * Describe the processes first and take the view of an external observer; define the desired processes, patterns, rules, etc.
  * Explain why and establish an explicit link between requirements and the processes; predefine points of interaction/data extraction
  * leverage things like sets of Kubernetes pods for each process type, 
  * allow for horizontal scaling (via load balancing, auto scaling, etc.)
9. disposability - graceful startup, shutdown, disposable, idempotent, robust against sudden death (also see CI/CD, rolling/blue green deploys)
  * use queues
  * fail fast (as possible/visible) - if not local, use build/deploy alerts/health checks and monitoring (and things like liveness, readiness, and startup probes in Kubernetes)
  * upon shut down, do not lose data and ensure nothing left behind
  * handle signals gracefully, e.g., via systemd, or individual processes like via Gunicorn as [documented here](https://docs.gunicorn.org/en/stable/signals.html).
10. dev/prod parity - they should not be wildly different
11. logs as event streams - the app should not attempt to write to or manage logfiles; instead, each running process writes its event stream, unbuffered, to stdout
  * configure root logging 
  * treat logs as event streams and send to centralized location via logging service
12. running admin/management tasks as one-off processes, e.g., running database migrations (e.g. manage.py migrate)
13. [OpenAPI spec-compliant](https://swagger.io/specification/) and clear and thoughtful API design - *it should describe the what and not the how*
14. security (credentials, authorization, including user auth)
15. telemetry - metrics and monitoring (e.g., prometheus, grafana, etc.)

**Notes**
1. [AWS reference](https://aws.amazon.com/blogs/compute/applying-the-twelve-factor-app-methodology-to-serverless-applications/),  [12 factor and Kubernetes by Red Hat](https://www.redhat.com/architect/12-factor-app-containers) and [illustrated](https://www.redhat.com/architect/12-factor-app)


## Structure
