# Citizen Portal API

This Citizen Portal API was created with [Node.js](https://nodejs.org/) version 12.16.x. [More Info](https://github.com/NurNils/T2000/tree/main/SOURCE/BACKEND/citizen-portal-api)

## Setup

1. Run `npm install` to download all needed packages and it's dependencies.

2. Go to the API folder and create a `.env` file with the following content (update if necessary):
```javascript
// If PRODUCTION=true: Database connection with authorization below (user and password), otherwise it connects without authorization.
PRODUCTION=false 
PORT=3000
APP_NAME="Citizen Portal"
APP_DOMAIN="citizen-portal.com"
APP_MAIL="hi@citizen-portal.com"
JWT_SECRET="JWT_SECRET"
DB_PORT=27017
DB_HOSTNAME="localhost"
DB_DATABASE="database"
DB_USER="user"
DB_PASSWORD="password"
FILES_IMAGE="image/bmp,image/x-bmp,image/x-ms-bmp,image/cis-cod,image/cmu-raster,image/fif,image/gif,image/ief,image/jpeg,image/png,image/svg+xml,image/tiff,image/vasa,image/vnd.wap.wbmp,image/x-freehand,image/x-icon,image/x-portable-anymap,image/x-portable-bitmap,image/x-portable-graymap,image/x-portable-pixmap,image/x-rgb,image/x-windowdump,image/x-xbitmap,image/x-xpixmap"
```

## Server

Run `npm start` for a Node.js server. Navigate to `http://localhost:3000/` or defined port in `.env` file. The app will automatically reload if you change any of the source files because of [nodemon](https://nodemon.io/).