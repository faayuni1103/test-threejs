// UNUSED


import { google } from 'googleapis';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/get-data', async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './client_secret.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
        const spreadsheetId = '1xM5YA5lwo10NSp9SfxQEWaROSj2PPPVFb2n5yjELDtc';
        const range = 'Sheet1!A2:Z';
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

        res.json({ data: response.data.values || [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));


/*
import { google } from 'googleapis';
// Initializes the Google APIs client library and sets up the authentication using service account credentials.
const auth = new google.auth.GoogleAuth({
    keyFile: './client_secret.json',  // Path to your service account key file.
    scopes: ['https://www.googleapis.com/auth/spreadsheets']  // Scope for Google Sheets API.
});

async function authenticate() {
    try {
        const authClient = await auth.getClient();
        console.log('Authentication successful');
        // Use `authClient` for your API requests
    } catch (err) {
        console.error('Authentication error:', err);
    }
}

authenticate();

// Asynchronous function to read data from a Google Sheet.
async function readSheet() {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1xM5YA5lwo10NSp9SfxQEWaROSj2PPPVFb2n5yjELDtc';
    
    try {
        const range = 'Sheet1!A2:Z';  // Specifies the range to read. (Excludes headers in A1)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId, range
        });
        const rows = response.data.values;  // Extracts the rows from the response.
        
        if (!rows || rows.length === 0) {
            console.log('No data found.');
            return [];
        }

        console.log(`${rows.length} rows fetched`);
        return rows; // Returns all rows including headers.
    } catch (error) {
        console.error('error', error);  // Logs errors.
    }
}

// Function to classify the rows into categories and convert into a 2D array
function classifyData(rows) {
    // Return the data as a 2D array with each row representing a row in the Google Sheet
    return rows.map(row => row);
}

// Initialize an array to store the classified data
let classifiedData = [];

// Immediately-invoked function expression (IIFE) to execute the read and classify operations
(async () => {
    const rows = await readSheet();  // Read data from the sheet
    if (rows.length > 0) {
        classifiedData = classifyData(rows);  // Classify the data into a 2D array
        //console.log(classifiedData[3][2]);
        console.log(classifiedData.length);
    }
})();

/*
import * as THREE from 'three';

import TWEEN from 'three/addons/libs/tween.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

let camera, scene, renderer;
let controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 3000;

    scene = new THREE.Scene();

    // table

    for ( let i = 0; i < classifiedData.length; i += 1 ) {

        // buat kotak, color ikut col 6 net worth
        const element = document.createElement( 'div' );
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

        // numbering di kanan aka age col 3, kiri aka country col 4
        const age = document.createElement( 'div' );
        age.className = 'age';
        age.textContent = classifiedData[i][2];
        element.appendChild( age );

        const country = document.createElement( 'div' );
        country.className = 'country';
        country.textContent = classifiedData[i][3];
        element.appendChild( country );

        // simbol tengah2 aka gambar column 2
        const image = document.createElement( 'img' );
        image.className = 'image';
        image.src = classifiedData[i][1];
        element.appendChild( image );

        // nama di bawah pastu atomic number aka nama col 1, bawah interest col 5
        const details = document.createElement( 'div' );
        details.className = 'details';
        details.innerHTML = classifiedData[i][0] + '<br>' + classifiedData[i][4];
        element.appendChild( details );

        const objectCSS = new CSS3DObject( element );
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add( objectCSS );

        objects.push( objectCSS );

        //

        const object = new THREE.Object3D();
        object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
        object.position.y = - ( table[ i + 4 ] * 180 ) + 990;

        targets.table.push( object );
        

        

    }

    // sphere

    const vector = new THREE.Vector3();

    for ( let i = 0, l = objects.length; i < l; i ++ ) {

        const phi = Math.acos( - 1 + ( 2 * i ) / l );
        const theta = Math.sqrt( l * Math.PI ) * phi;

        const object = new THREE.Object3D();

        object.position.setFromSphericalCoords( 800, phi, theta );

        vector.copy( object.position ).multiplyScalar( 2 );

        object.lookAt( vector );

        targets.sphere.push( object );

    }

    // helix

    for ( let i = 0, l = objects.length; i < l; i ++ ) {

        const theta = i * 0.175 + Math.PI;
        const y = - ( i * 8 ) + 450;

        const object = new THREE.Object3D();

        object.position.setFromCylindricalCoords( 900, theta, y );

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt( vector );

        targets.helix.push( object );

    }

    // grid

    for ( let i = 0; i < objects.length; i ++ ) {

        const object = new THREE.Object3D();

        object.position.x = ( ( i % 5 ) * 400 ) - 800;
        object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
        object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

        targets.grid.push( object );

    }

    //

    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById( 'container' ).appendChild( renderer.domElement );

    //

    controls = new TrackballControls( camera, renderer.domElement );
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener( 'change', render );

    const buttonTable = document.getElementById( 'table' );
    buttonTable.addEventListener( 'click', function () {

        transform( targets.table, 2000 );

    } );

    const buttonSphere = document.getElementById( 'sphere' );
    buttonSphere.addEventListener( 'click', function () {

        transform( targets.sphere, 2000 );

    } );

    const buttonHelix = document.getElementById( 'helix' );
    buttonHelix.addEventListener( 'click', function () {

        transform( targets.helix, 2000 );

    } );

    const buttonGrid = document.getElementById( 'grid' );
    buttonGrid.addEventListener( 'click', function () {

        transform( targets.grid, 2000 );

    } );

    transform( targets.table, 2000 );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function transform( targets, duration ) {

    TWEEN.removeAll();

    for ( let i = 0; i < objects.length; i ++ ) {

        const object = objects[ i ];
        const target = targets[ i ];

        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    }

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render )
        .start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function animate() {

    requestAnimationFrame( animate );

    TWEEN.update();

    controls.update();

}

function render() {

    renderer.render( scene, camera );

}*/