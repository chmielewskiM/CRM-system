 # CRM system ![alt text](https://dev.azure.com/chmielewskimsz/CRM-system/_apis/build/status/sys-crm%20-%20CI?branchName=master) 
 
 ###### *RESTful web app*

The main purpose of this project was to build a tool which will boost the workflow inside a company by enhancing sale management
and providing broader insight into workers' actions. In order to achieve these goals, the app serves various features which are described in the following sections.

## API specification        
### <p align="center"><a href="https://petstore.swagger.io/?url=https://raw.githack.com/chmielewskiM/CRM-system/master/API-spec.yaml" align="ctr">***Link to swagger petstore*** </a></p>
<p align="center"> <a href="https://petstore.swagger.io/?url=https://raw.githack.com/chmielewskiM/CRM-system/master/API-spec.yaml" align="ctr"> 
 <img width="80%" valign="bottom" src="https://s3.gifyu.com/images/swagger2fcf591146bc942c5.png"></a></p>

<br>

## Tech/framework used
|<div align="center"><img height="50" width="50" valign="middle" src="https://svgshare.com/i/W5Y.svg"></div>|<div align="center"><img height="50" width="50" valign="middle" src="https://svgshare.com/i/W5j.svg"></div> |
|-------------|-------------|


|<div align="center"><img height="50" width="50" valign="middle" src="https://cdn.svgporn.com/logos/css-3.svg"></div>|<div align="center"><img height="50" width="50" valign="middle" src="https://cdn.svgporn.com/logos/sass.svg"></div>| <div align="center"><img height="50" width="50" valign="middle" src="https://github.com/Semantic-Org/Semantic-UI-React/raw/master/docs/public/logo.png"></div>| <div align="center"><img height="50" width="50" valing="middle" src="https://cdn.svgporn.com/logos/react.svg"></div> | <div align="center"><img height="50" width="50" valign="middle" src="https://svgshare.com/i/W4e.svg"></div>| 
|-------------|-------------|-------------|-------------|-------------| 

#### Tools:
|<div align="center"><img height="50" width="50" valign="middle" src="https://svgshare.com/i/W5Z.svg"></div>|<div align="center" ><img height="50" width="50" valign="middle" src="https://cdn.svgporn.com/logos/npm.svg"></div>|<div align="center" ><img height="50" width="50" valign="middle" src="https://cdn.svgporn.com/logos/visual-studio.svg"></div>|<div align="center" ><img height="50" width="50" valign="middle" src="https://cdn.svgporn.com/logos/visual-studio-code.svg"></div>|<div align="center" ><img height="50" width="100" valign="middle" src="https://raw.githack.com/prplx/svg-logos/master/svg/azure.svg"></div>|<div align="center"><img height="50" width="50" valign="middle" src="https://brandslogos.com/wp-content/uploads/images/large/microsoft-sql-server-logo-vector.svg"></div>|
|-------------|-------------|-------------|-------------|-------------|-------------|

#### Packages and other:

* Automapper
* IdentityEF
* Fluent Validation
* MediatR
* JWT
* Swagger
* xUnit
* Moq
* Fluent Assertions
* create-react-app
* react-router-dom
* mobx-react-lite
* am4Charts
 ***... and more***
<br>

* Postman
* SSMS
* .Net CLI
<br>

## Installation

### Server (.NET Core)

###### *Requirements:*

###### *.NET Core SDK*

#### Execute `dotnet restore` in root directory.
#### Then build the project with `dotnet build`.

### Client (React)

###### *Requirements:*

###### *Node*
###### *npm*

#### Go to client-app folder and execute `npm install`  

### -Development env-

##### Change "ASPNETCORE_ENVIRONMENT" to "Development" in `launchSettings.json`.

##### In client-app folder execute `npm run-script start-watch` .

##### In API folder exectute `dotnet watch run`.

### -Production env-

##### In client-app folder execute `npm run build` (it will create build and move it to the API folder).

##### Go to the API folder and execute `dotnet watch run`.

``` 
Seeded users

Login: Admin | Manager | Manager-2 | Employee | Employee-2
Password: Qw123!
```

## Screenshots

***<p align="center">Click on the screenshot to see Gif.</p>***

<a href="https://s4.gifyu.com/images/dashboardb0c711e13dafd802.gif"><img src="https://s4.gifyu.com/images/dash.png" alt="dashboard" width="49.5%" height="280"></a><img width="1%"></img><a href="https://s4.gifyu.com/images/contactsec081b0316b6ed48.gif"><img src="https://s4.gifyu.com/images/contacts.png" alt="contacts" border="0" width="49.5%" height="280"></a>

<a href="https://s4.gifyu.com/images/leads.gif"><img src="https://s4.gifyu.com/images/leads.png" width="49.5%" height="280"></a><img width="1%"></img><a href="https://s4.gifyu.com/images/tasks.gif"><img src="https://s4.gifyu.com/images/tasks.png" alt="leads" border="0" width="49.5%" height="280"></a>

<a href="https://s4.gifyu.com/images/orders.gif"><img src="https://s4.gifyu.com/images/orders.png" width="49.5%" height="280"></a><img width="1%"></img><a href="https://s4.gifyu.com/images/admin2.gif"><img src="https://s4.gifyu.com/images/admin.png" width="49.5%" height="280"></a>

<br>

## Features

```
   * Custom error handling
   * Server-side form validation (Fluent Validation with custom tweaks)
   * Server-side filtering
   * Server-side sorting
   * Server-side pagination
   * Three levels of access: top(admin), mid(manager), low(employee) 
```
   ### Brief description

  #### Dashboard
  
  Dashboard includes statistics that let user know what is workers' efficiency and how is the company doing at the moment. 
User may choose between two periods of time: recent 30 days or 6 months.
There are 5 charts:
* sales pipeline - shows the ratio of particular advancement stage towards amount of leads
* source - a pie chart which shows where leads came from
* leads - a chart which shows total amount of leads
* leads/opportunity - a chart which lets user know what is the overall efficiency of converting leads into opportunities
* leads/opportunities by employee - a chart as above, but categorized by workers, so user can see the efficiency of particular worker

Moreover there are stats of this month (from day 1 of the current month) and a calendar which displays tasks related to user.

   #### Contacts
   
Contacts section is basically an address book. It includes all CRUD operations. User may add, edit or delete a contact, see contact's details, promote contact to premium member or start a sale process. When sale process is started that way, source of the lead is set to 'Former Client'.
The list component is sortable, filterable and paginated. Sortable by header cells, filterable by buttons and search input which sends(on change) request after at least 2 letters are typed in.
   
   #### Leads
   
 This section allows user to control the whole sale process. Every user has an access only to his leads. There are 4 stages: lead, opportunity, quote, invoice. All CRUD operations are available. Every operation in the chain, from lead to conversion,
 is tracked and registered. User may send straightforward an email to client, upgrade client's status or downgrade it in case of mistake with auto correction of previous operations which is crucial for proper displaying of stats on dashboard. User may choose anytime 
 whether he wants to terminate whole process and keep data about operations which were done during this process or abandon lead and delete all registered operations which are included in this particular process. At the same time user may choose whether he wants to keep this lead in 
 his address book or delete it entirely. 
 Before upgrading client's status to invoice, there has to be an order assigned to the client. Before converting client the order has to be closed.
 Before terminating a process there must be no order assigned to the client.
   
   #### Tasks
   
The task's list may be filtered by 'my tasks', 'shared by me' or 'shared with me'. Shared tasks have subcategories which filter those tasks by their status. There are 4 states of tasks: 'pending', 'accepted', 'refused', 'done' and all of them are marked with proper icon.
Besides all CRUD actions there is also a possibility to share a task. The user whom a task is shared with can see it in 'pending tasks'.
      
   #### Orders
   
All CRUD operations are included. There are list, history and detail components available in this section. The list component is sortable and filterable (by 'all', 'sale', 'purchase' buttons or search input).
History is paginated and also filterable by the type of transactions. User may add an order only to contacts which he posess in his contacts list. A contact may have only 1 active order assigned.
User chooses the type of order, client to assign, product, amount and price. He may optionally include some notes.

   #### Admin panel
   
Basically admin panel is a form. Admin is able to add, edit or delete users. ASP.NET Core Identity is used for this purpose, users are managed with AspNetUserManager. Editing includes setting new password.

<br>

## CI/CD

Chosen platform to set up CI/CD is ***Azure***.

### Pipeline
<div align="center"><img valign="middle" src="https://s3.gifyu.com/images/azure.png"></div>
<br>
<div align="center"><img valign="middle" src="https://s4.gifyu.com/images/stage.png"></div>

<br>
