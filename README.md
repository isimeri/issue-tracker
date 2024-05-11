# Issue Tracker -- [[live]]()

An issue tracking API with a simple frontend interface for making the interaction with the backend easier. On the `/` page there are forms for doing `POST`, `PUT` and `DELETE` requests. The `GET` requests happen automatically when visiting a `/:project-name` page, whether `project-name` exists or not. There is a project that is there by default,  namely `apitest`. All the data sent through the `POST` form on the **index** page gets associated with the `apitest` project.
___
Click [here]() to check out the live app.
___
![issue tracker index page screenshot](https://i.imgur.com/ot8OJae.png)

## Index page
There are 3 forms on the index page:  
- The first one from the left is a `POST` form. All issues have a project they belong to and all the issues created using this form are by default associated with the `apitest` project. The **title**, **description text** and **created by** fields are mandatory, the rest being optional.  
- The second one is a `PUT` form. Any issue, belonging to any project, can be updated through this form. The only mandatory field is the `_id` of the issue. The fields that are left empty won't be updated(i.e. the corresponding variables inside the database won't be deleted, set to zero, null, empty string, etc.);  
- The third form is a `DELETE` form. All it requires is an **_id** and the corresponding issue gets deleted, regardless of the project it belongs to.

Not filling out mandatory fields, providing an issue `_id` that is invalid or does not exist and submitting only the `_id_` field on the **update** form without anything else will generate appropriate responses.

## URL operations
All the issues associated with a certain project can be viewed in a JSON format by accessing `/api/issues/:project-name`. Furthermore, query parameters are supported. For example, accessing `/api/issues/:project-name?created_by=spongebob` will display all the issues on `project-name` created by **spongebob**. The query parameters are also chainable, e.g. accessing `/api/issues/:project-name?open=false&assigned_to=harambe` will display all the issues under `project-name` that are closed and were assigned to **harambe**.
___

![apitest project page screenshot](https://i.imgur.com/adej7r9.png)

## Project page
This page can be accessed by going to `/:project-name`. This page displays all the issues belonging to the project the page is about on a simple frontend.
Also, on this page new issues can be created and they will belong to the project in question, instead of the default `apitest` project.  
Issues on this page can be closed and deleted with ease, without having to find and copy-paste issue ids.

A new project can be created by accessing `/:your-new-project`, where `your-new-project` is whatever project name you picked (e.g. to create project **salad**, go to `/salad`). These names have to be unique, of course, if there already is a **salad** project, you won't be able to create another.

___
This project is built as part of the [FreeCodeCamp's](https://www.freecodecamp.org) Quality Assurance certification.  
Inspiration for building this project can be found [here](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker)
