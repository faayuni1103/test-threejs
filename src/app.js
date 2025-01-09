import * as THREE from 'three';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

let camera, scene, renderer, controls;
let objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };
let arrayData = [];

fetch('http://localhost:3000/get-data')
  .then(response => response.json())
  .then(data => {
    arrayData = data.data;
    init();
  })
  .catch(error => console.error('Error fetching data:', error));

function init() {
    console.log(arrayData); // Check if arrayData is loaded correctly

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;

    scene = new THREE.Scene();

    const rows = 10; // Number of rows
    const cols = 20; // Number of columns
    const spacingX = 200; // Horizontal spacing between objects
    const spacingY = 200; // Vertical spacing between objects

    for (let i = 0; i < arrayData.length; i++) {
        // Create the element as before
        const element = document.createElement('div');
        element.className = 'element';
        if (arrayData[i][5]) {
            // Remove $ sign and parse to number
            const value = parseFloat(arrayData[i][5].replace('$', '').replace(',', '')); // Also handles thousands separators
            
            // Check if the value is greater than 100000
            if (value > 200000) {
                console.log(`Row ${i}: Value ${value} is greater than 200000.`);
                element.style.backgroundColor = '#EF3022';
                
            } else if (value > 100000){
                console.log(`Row ${i}: Value ${value} is greater than 100000.`);
                element.style.backgroundColor = '#FDCA35'; // Yellow

            } else {
                console.log(`Row ${i}: Value ${value} is less than both`);
                element.style.backgroundColor = '#3A9F48'; // Green
            }
        } else {
            console.log(`Row ${i}: No value in column 5.`);
        }

        // Add other child elements for age, country, image, etc.
        const age = document.createElement('div');
        age.className = 'age';
        age.textContent = arrayData[i][2];
        element.appendChild(age);

        const country = document.createElement('div');
        country.className = 'country';
        country.textContent = arrayData[i][3];
        element.appendChild(country);

        const image = document.createElement('img');
        image.className = 'image';
        image.src = arrayData[i][1];
        element.appendChild(image);

        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = arrayData[i][0] + '<br>' + arrayData[i][4];
        element.appendChild(details);

        // Create the CSS3DObject
        const objectCSS = new CSS3DObject(element);
        // Calculate the position of the object in the table
        const row = Math.floor(i / cols); // Calculate the row index (0 to 19)
        const col = i % cols; // Calculate the column index (0 to 9)
        
        // Position the object in the table layout
        objectCSS.position.set(col * spacingX - (cols * spacingX) / 2, -row * spacingY + (rows * spacingY) / 2, Math.random() * 2000 - 1000);
        scene.add(objectCSS);
        objects.push(objectCSS);

        // Create target for transformation (table layout)
        const object = new THREE.Object3D();
        object.position.set(col * spacingX - (cols * spacingX) / 2, -row * spacingY + (rows * spacingY) / 2, 0);
        targets.table.push(object);
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

    const helixRadius = 900; // Radius of the helix
    const helixSeparation = 30; // Vertical separation between the two helices
    const helixTurns = 0.2; // Angle increment for each object
    const yIncrement = 15; // Vertical separation between objects (tighter twist)

    // Base-pair appearance
    const basePairLength = 200; // Length of base pairs connecting the helices
    const basePairColor = 0x00ff00; // Green color for base pairs

    const totalObjects = 100; // Total number of segments in the helix

    for (let i = 0; i < totalObjects; i++) {
        const theta = i * helixTurns; // Angular position for the helix
        const y = i * yIncrement; // Y-axis position

        // Create the first helix object
        const object1 = new THREE.Object3D();
        object1.position.setFromCylindricalCoords(helixRadius, theta, y);
        targets.helix.push(object1);

        // Create the second helix object, offset by π radians
        const object2 = new THREE.Object3D();
        object2.position.setFromCylindricalCoords(helixRadius, theta + Math.PI, y + helixSeparation);
        targets.helix.push(object2);

        // Add base pair connector between the two helices
        const basePairGeometry = new THREE.CylinderGeometry(5, 5, basePairLength, 8); // Thin cylinder
        const basePairMaterial = new THREE.MeshBasicMaterial({ color: basePairColor });
        const basePair = new THREE.Mesh(basePairGeometry, basePairMaterial);

        // Position base pair at the midpoint between the two helices
        basePair.position.x = (object1.position.x + object2.position.x) / 2;
        basePair.position.y = (object1.position.y + object2.position.y) / 2;
        basePair.position.z = (object1.position.z + object2.position.z) / 2;

        // Rotate base pair to align with the vector between the two helix points
        const vector = new THREE.Vector3().subVectors(object2.position, object1.position);
        basePair.lookAt(vector.add(basePair.position));

        // Add the base pair to the scene
        scene.add(basePair);
    }

    // grid

    const gridX = 5; // Number of objects along the X-axis
    const gridY = 4; // Number of objects along the Y-axis
    const gridZ = 10; // Number of objects along the Z-axis

    for (let i = 0; i < objects.length; i++) {
        const object = new THREE.Object3D();

        // Calculate the grid position
        const xIndex = i % gridX; // Position along the X-axis
        const yIndex = Math.floor(i / gridX) % gridY; // Position along the Y-axis
        const zIndex = Math.floor(i / (gridX * gridY)); // Position along the Z-axis

        // Set object position based on grid indices
        object.position.x = (xIndex * 200) - (gridX * 200) / 2; // Center grid along X-axis
        object.position.y = -(yIndex * 300) + (gridY * 300) / 2; // Center grid along Y-axis
        object.position.z = (zIndex * 400) - (gridZ * 400) / 2; // Center grid along Z-axis

        targets.grid.push(object);
    }

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener('change', render);

    window.addEventListener('resize', onWindowResize);

    const buttonTable = document.getElementById('table');
    buttonTable.addEventListener('click', function () {
        transform(targets.table, 2000);
    });

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

  transform(targets.table, 2000);
}

function transform(targets, duration) {
  TWEEN.removeAll();
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targets[i];
    new TWEEN.Tween(object.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
