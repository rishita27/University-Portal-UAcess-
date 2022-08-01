# UAccess - Group 5

UAccess is a portal to make the lives of students applying to colleges or universities easier by providing them a single stop solution. The frontend of the application is developed using the JavaScript library React and the backend of the application is developed using the python micro framework Flask. 

- _Date Created_: 23 FEB 2022
- _Last Modification Date_: 12 APR 2022
- _UI App URL_: <https://uaccess-ui.herokuapp.com/>
- _Backend App URL_: <https://uaccess-backend.herokuapp.com/>
- _Git URL_: <https://git.cs.dal.ca/jasoliya/5709-group5-project>

## Authors

- [Aasif Faizal](https://git.cs.dal.ca/faizal) - _(Fullstack Developer)_
- [Amrita Krishna](https://git.cs.dal.ca/akrishna) - _(Fullstack Developer)_
- [Foram Gaikwad](https://git.cs.dal.ca/fgaikwad) - _(Fullstack Developer)_
- [Rishita Kotiyal](https://git.cs.dal.ca/kotiyal) - _(Fullstack Developer)_
- [Rushit Jasoliya](https://git.cs.dal.ca/jasoliya) - _(Fullstack Developer)_

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Built With](#built-with)
    - [Frontend Application](#frontend-application)
    - [Backend Application](#backend-application)
- [Sources used](#sources-used)

## Getting Started

**Below is a Admin User Credentials which are static for this application**

```
    email: admin@gmail.com
    password: Admin@123
```

Other type of user has to create with registration process only.

**Note: Please check junk folder for notification email.**

## Prerequisites

To have a local copy of this tutorial up and running on your local machine, you will first need to install the following software / libraries / plug-ins

* [npm](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/en/)
* [Python](https://www.python.org/downloads/)
* [Pip](https://pip.pypa.io/en/stable/installation/)
* [MySQL](https://www.mysql.com/)

See the following section for detailed step-by-step instructions on how to install this software / libraries / plug-ins

### Installation

Npm is included with node.js installation hence install node by downloading it from [here](https://nodejs.org/en/).

The frontend dependencies can be installed by navigating to the `frontend` folder and running the following command.

```shell
npm install .
```

The backend dependencies can be installed by navigating to the `backend` folder and running the following command.

```shell
pip install -r requirements.txt
```

### Environment Variables

Inorder to run the backend application the following environment variables needs to be set.
- `DB_ENGINE`: The database engine used for the application. Here since we use mysql, the value should be `mysql`.
- `DB_USER`: The value should be username which has access to the database.
- `DB_PASSWORD`: The password of the user.
- `DB_PASSWORD`: The hostname of the database.
- `DB_DATABASE`: The schema name where the tables are present.
- `AWS_ACCESS_KEY_ID`: The access key id of the user which has access for AWS S3 put and get methods.
- `AWS_SECRET_ACCESS_KEY`: The seceret access of the above user.
- `AWS_DEFAULT_REGION`: The default AWS region.
- `NOTIFICATION_SENDER_EMAIL`: The email used to send notification mails.
- `NOTIFICATION_SENDER_PASSWORD`: The password of the sender email.

### Available Scripts

To run the fronend application, navigate to the frontend directory and run:

```shell
npm start
```

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.

To run the backend application, navigate to the backend directory and run:

```shell
python app.py
```

Runs the app in the development mode. The application will be running in [http://localhost:5000](http://localhost:5000).

## Deployment

The application is deployed to [Heroku](https://www.heroku.com/platform). Any commits to the main branch gets automatically deployed using CI/CD and  the commands can be found in [`.gitlab-ci.yml`](https://git.cs.dal.ca/jasoliya/5709-group5-project/-/blob/main/.gitlab-ci.yml). Both fronend and backend will be deployed. The backend application is run in the heroku server using the commands from the [`Procfile`](https://git.cs.dal.ca/jasoliya/5709-group5-project/-/blob/main/backend/Procfile)

## Built With

### Frontend Application

- [React](https://reactjs.org/docs/getting-started.html) - The front end framework used.
- [React Bootstrap](https://react-bootstrap.github.io/getting-started/introduction) - Framework that provided UI components. Wrapper around Bootstrap for react.
- [Bootstrap](https://getbootstrap.com/docs/5.1/getting-started/introduction/) - Used for styling.
- [Sass](https://sass-lang.com/documentation) - Used for styling the pages.
- [Axios](https://axios-http.com/docs/intro) - HTTP client used to perform http requests.
- [React Router](https://reactrouter.com/) - The library used for routing and navigating pages.
- [Create React App Buildpack](https://github.com/mars/create-react-app-buildpack) - Used for deploying build pack to heroku.

### Backend Application

- [Flask](https://flask.palletsprojects.com/): The backend micro framework used.
- [MySQL](https://www.mysql.com/): The database used. The main reason for choosing MySQL is that the data is structured and a RDBMS would be really helpful in querying.
- [SQLModel](https://sqlmodel.tiangolo.com/): The ORM used for the project.
- [Flask-Cors](https://flask-cors.readthedocs.io/en/latest/): The library that helps in allowing CORS requests which is needed as the requests are to the backend is coming from a different origin.
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/en/stable/): The library that helps in jwt token generation and validation. It enhances the security of the application.
- [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html): The client to interact with AWS services.


## Sources used

### [`backend/storage/db.py`](https://git.cs.dal.ca/jasoliya/5709-group5-project/-/blob/main/backend/storage/db.py)

*Line 28 - 31*

```py
    name = re.sub(r"([A-Z]+)([A-Z][a-z])", r'\1_\2', name)
    name = re.sub(r"([a-z\d])([A-Z])", r'\1_\2', name)
    name = name.replace("-", "_")
    return name.lower()
```

The code above was reused from the library [inflection](https://github.com/jpvanhal/inflection/blob/b00d4d348b32ef5823221b20ee4cbd1d2d924462/inflection/__init__.py#L397) as shown below: 

```py
    word = re.sub(r"([A-Z]+)([A-Z][a-z])", r'\1_\2', word)
    word = re.sub(r"([a-z\d])([A-Z])", r'\1_\2', word)
    word = word.replace("-", "_")
    return word.lower()
```

- The code in [inflection](https://github.com/jpvanhal/inflection/blob/b00d4d348b32ef5823221b20ee4cbd1d2d924462/inflection/__init__.py#L397) was implemented by Janne Vanhala. He is the creator of the library.
- [Inflection](https://github.com/jpvanhal/inflection/blob/b00d4d348b32ef5823221b20ee4cbd1d2d924462/inflection/__init__.py#L397)'s `underscore` function is used for converting class names of the models to database tablename which is underscored. The regex comes in handy as we do not have to sepecify the underscored table name in every model.
- [Inflection](https://github.com/jpvanhal/inflection/blob/b00d4d348b32ef5823221b20ee4cbd1d2d924462/inflection/__init__.py#L397)'s code was modified by [Aasif Faizal](https://git.cs.dal.ca/faizal).


*Line 43 - 46*

```py
    _uuid = uuid.uuid4()
    while _uuid.hex[0] == '0':
        _uuid = uuid.uuid4()
    return _uuid
```

The code above was reused from the [comment](https://github.com/tiangolo/sqlmodel/issues/25#issuecomment-982039809) from the [issue](https://github.com/tiangolo/sqlmodel/issues/25) in SQLModel as shown below: 

```py
    val = uuid.uuid4()
    while val.hex[0] == '0':
        val = uuid.uuid4()

    return val
```

- The code in the [comment](https://github.com/tiangolo/sqlmodel/issues/25#issuecomment-982039809) was implemented by [Chris White](https://github.com/chriswhite199).
- [Chris White](https://github.com/chriswhite199)'s comment function is a workaround for the SQLModel's uuid serialization where leading zeros result in the error `ValueError: badly formed hexadecimal UUID string`,
- The code implemented by [Chris White](https://github.com/chriswhite199) was modified by [Aasif Faizal](https://git.cs.dal.ca/faizal) for tackling the error caused by the UUIDs with leadning zeros. Another approach was to use [sqlalchemy-utils](https://sqlalchemy-utils.readthedocs.io/en/latest/data_types.html#module-sqlalchemy_utils.types.uuid) library which was not used to avoid adding more dependencies.
