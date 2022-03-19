import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { Skeleton } from "./skeleton";
import "./style.css";
// import * as THREE from "https://cdn.skypack.dev/three@0.138.0";
// import { GLTFLoader } from "https://cdn.skypack.dev/three@0.138.0/examples/jsm/loaders/GLTFLoader.js";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
const videoEl = document.querySelector<HTMLVideoElement>("video")!;
const canvasEl = document.querySelector<HTMLCanvasElement>("canvas")!;
// const ctx = canvasEl.getContext("2d")!;
const ctx2 = canvasEl.getContext("webgl")!;
const engine = new BABYLON.Engine(canvasEl, true);
const scene = new BABYLON.Scene(engine);
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.createDefaultEnvironment({
    createGround: false,
    createSkybox: false,
  });
  const camera = new BABYLON.ArcRotateCamera(
    "mainCam",
    Math.PI,
    Math.PI,
    3,
    BABYLON.Vector3.Zero(),
    scene,
    true
  );
  camera.attachControl(canvasEl, true);
  camera.attachControl(canvasEl);
  const light = new BABYLON.DirectionalLight(
    "sun",
    new BABYLON.Vector3(0, -1, -0.5),
    scene
  );

  const videoLayer = new BABYLON.Layer("videoLayer", null, scene, true);
  const videoTexture = BABYLON.VideoTexture.CreateFromWebCam(
    scene,
    (videoTexture) => {
      videoTexture._invertY = false;
      videoTexture;
      videoLayer.texture = videoTexture;
    },
    {
      minWidth: 640,
      minHeight: 480,
      maxWidth: 1920,
      maxHeight: 1080,
      deviceId: "",
    }
  );

  const box = BABYLON.MeshBuilder.CreateBox("dummyBox", { size: 1 }, scene);
  BABYLON.SceneLoader.Append(
    "src/assets/",
    "shirt.gltf",
    scene,
    function (scene) {
      // Create a default arc rotate camera and light.
      scene.createDefaultCameraOrLight(true, true, true);

      // The default camera looks at the back of the asset.
      // Rotate the camera by 180 degrees to the front of the asset.
      scene.activeCamera.alpha += Math.PI;
    }
  );

  // const box = BABYLON.MeshBuilder.CreateBox("box", {});
  //   var gltf = `{
  //     "asset": {
  //         "generator": "COLLADA2GLTF",
  //         "version": "2.0"
  //     },
  //     "scene": 0,
  //     "scenes": [
  //         {
  //             "nodes": [
  //                 0
  //             ]
  //         }
  //     ],
  //     "nodes": [
  //         {
  //             "children": [
  //                 1
  //             ],
  //             "matrix": [
  //                 1.0,
  //                 0.0,
  //                 0.0,
  //                 0.0,
  //                 0.0,
  //                 0.0,
  //                 -1.0,
  //                 0.0,
  //                 0.0,
  //                 1.0,
  //                 0.0,
  //                 0.0,
  //                 0.0,
  //                 0.0,
  //                 0.0,
  //                 1.0
  //             ]
  //         },
  //         {
  //             "mesh": 0
  //         }
  //     ],
  //     "meshes": [
  //         {
  //             "primitives": [
  //                 {
  //                     "attributes": {
  //                         "NORMAL": 1,
  //                         "POSITION": 2
  //                     },
  //                     "indices": 0,
  //                     "mode": 4,
  //                     "material": 0
  //                 }
  //             ],
  //             "name": "Mesh"
  //         }
  //     ],
  //     "accessors": [
  //         {
  //             "bufferView": 0,
  //             "byteOffset": 0,
  //             "componentType": 5123,
  //             "count": 36,
  //             "max": [
  //                 23
  //             ],
  //             "min": [
  //                 0
  //             ],
  //             "type": "SCALAR"
  //         },
  //         {
  //             "bufferView": 1,
  //             "byteOffset": 0,
  //             "componentType": 5126,
  //             "count": 24,
  //             "max": [
  //                 1.0,
  //                 1.0,
  //                 1.0
  //             ],
  //             "min": [
  //                 -1.0,
  //                 -1.0,
  //                 -1.0
  //             ],
  //             "type": "VEC3"
  //         },
  //         {
  //             "bufferView": 1,
  //             "byteOffset": 288,
  //             "componentType": 5126,
  //             "count": 24,
  //             "max": [
  //                 0.5,
  //                 0.5,
  //                 0.5
  //             ],
  //             "min": [
  //                 -0.5,
  //                 -0.5,
  //                 -0.5
  //             ],
  //             "type": "VEC3"
  //         }
  //     ],
  //     "materials": [
  //         {
  //             "pbrMetallicRoughness": {
  //                 "baseColorFactor": [
  //                     0.800000011920929,
  //                     0.0,
  //                     0.0,
  //                     1.0
  //                 ],
  //                 "metallicFactor": 0.0
  //             },
  //             "name": "Red"
  //         }
  //     ],
  //     "bufferViews": [
  //         {
  //             "buffer": 0,
  //             "byteOffset": 576,
  //             "byteLength": 72,
  //             "target": 34963
  //         },
  //         {
  //             "buffer": 0,
  //             "byteOffset": 0,
  //             "byteLength": 576,
  //             "byteStride": 12,
  //             "target": 34962
  //         }
  //     ],
  //     "buffers": [
  //         {
  //             "byteLength": 648,
  //             "uri": "data:application/octet-stream;base64,AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAvwAAAL8AAAA/AAAAPwAAAL8AAAA/AAAAvwAAAD8AAAA/AAAAPwAAAD8AAAA/AAAAPwAAAL8AAAA/AAAAvwAAAL8AAAA/AAAAPwAAAL8AAAC/AAAAvwAAAL8AAAC/AAAAPwAAAD8AAAA/AAAAPwAAAL8AAAA/AAAAPwAAAD8AAAC/AAAAPwAAAL8AAAC/AAAAvwAAAD8AAAA/AAAAPwAAAD8AAAA/AAAAvwAAAD8AAAC/AAAAPwAAAD8AAAC/AAAAvwAAAL8AAAA/AAAAvwAAAD8AAAA/AAAAvwAAAL8AAAC/AAAAvwAAAD8AAAC/AAAAvwAAAL8AAAC/AAAAvwAAAD8AAAC/AAAAPwAAAL8AAAC/AAAAPwAAAD8AAAC/AAABAAIAAwACAAEABAAFAAYABwAGAAUACAAJAAoACwAKAAkADAANAA4ADwAOAA0AEAARABIAEwASABEAFAAVABYAFwAWABUA"
  //         }
  //     ]
  // }`;

  //   BABYLON.SceneLoader.Append("", "data:" + gltf, scene, function () {
  //     scene.createDefaultCamera(true, true, true);
  //   });

  return scene;
};
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   45,
//   canvasEl.width / canvasEl.height,
//   1,
//   100
// );
// // { canvas: canvasEl, antialias: true }
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvasEl,
//   alpha: true,
//   antialias: true,
// });
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
// camera.position.z = 5;

// const loader = new GLTFLoader();
// loader.load(
//   "shirt.gltf",
//   function (gltf) {
//     scene.add(gltf.scene);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );
async function initCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
    audio: false,
  });

  let onVideoReady: (ready: boolean) => void;
  const videoReadyPromise = new Promise((resolve) => (onVideoReady = resolve));
  videoEl.onloadedmetadata = () => onVideoReady(true);

  videoEl.srcObject = stream;

  return videoReadyPromise;
}

async function initPoseDetection() {
  const model = poseDetection.SupportedModels.BlazePose;
  const detector = await poseDetection.createDetector(model, {
    runtime: "tfjs",
    modelType: "lite",
    maxPoses: 1,
  } as poseDetection.BlazePoseTfjsModelConfig);

  return detector;
}

async function start() {
  await initCamera();
  const sceneToRender = createScene();
  engine.runRenderLoop(function () {
    sceneToRender.render();
  });
  // const detector = await initPoseDetection();
  // const skeleton = new Skeleton(ctx);
  // renderer.render(scene, camera);
  // async function render() {
  //   const poses = await detector.estimatePoses(videoEl!, {
  //     maxPoses: 1,
  //     flipHorizontal: false,
  //     scoreThreshold: 0.4,
  //   });

  //   ctx.clearRect(0, 0, 640, 480);

  //   if (poses[0]) {
  //     skeleton.draw(poses[0]);
  //   }

  //   requestAnimationFrame(render);
  // }

  // render();
}

start();
