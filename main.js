import './style.css'
import * as THREE from "three";
// import * as dat from 'lil-gui'

/**
 * UIデバッグの実装
*/
// const gui = new dat.GUI()

// キャンバスの取得
const canvas = document.querySelector(".webgl")

/** 必須三要素 */
// Scene 
const scene = new THREE.Scene()

// サイズ設定
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
  
// Camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.z = 6
scene.add(camera)

// レンダラー
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // 背景画像を設定する場合に必要
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/** 
 * オブジェクトを作成
*/
// マテリアル
const material = new THREE.MeshPhysicalMaterial({
    color: "#a4512d",
    metalness: 0.975,
    roughness: 0.35,
    flatShading: true,
})

// UIデバッグ
// gui.addColor(material, "color")
// gui.add(material, "metalness").min(0).max(1).step(0.001)
// gui.add(material, "roughness").min(0).max(1).step(0.001)

// メッシュ

// 木箱
const boxSize = 0.4
const boxMesh = new THREE.Mesh(
    new THREE.BoxGeometry(boxSize, boxSize * 2.5, boxSize),
    material
)
boxMesh.position.set(0,-1.2,0)
// おみくじ棒
const stickSize = 1
const stickMesh = new THREE.Mesh(
    new THREE.BoxGeometry(stickSize / 10, stickSize, stickSize / 10),
    material
)
stickMesh.position.set(0,-1.0,0)

// UIデバッグ
// gui.add(stickMesh.position, "y").min(-1).max(-0.2).step(0.01)

// シーンに追加
scene.add(boxMesh)
scene.add(stickMesh)

// // 平行光源
const directionalLight = new THREE.DirectionalLight("#ffffff", 15)
directionalLight.position.set(2.5, 2.5, 2.5)
scene.add(directionalLight)


// 初回レンダリング
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);


// ブラウザのリサイズ
window.addEventListener("resize", () => {
    // サイズアップデート
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
  
    // カメラアップデート
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix() // お作法として設定する
  
    // レンダラー
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)
})

/* おみくじスクロール実装 */
const position_min = -1
const position_max = -0.2
let omikuji_text = 'あなたの恋の運勢は......'

function omikuji_logic() {
    if (stickMesh.position.y < position_max) {
        const random_num = Math.random()
        if (random_num <= 0.2) {
            omikuji_text  = '大吉'
        } else if (random_num <= 0.4) {
            omikuji_text  = '中吉'
        } else if (random_num <= 0.6) {
            omikuji_text  = '吉'
        } else if (random_num <= 0.8) {
            omikuji_text  = '小吉'
        } else if (random_num <= 1.0) {
            omikuji_text  = '末吉'
        }
    }
    if (stickMesh.position.y == position_min) {
        omikuji_text  = 'あなたの恋の運勢は......'
    }
    document.getElementById('omikuji_result').textContent  = omikuji_text
}

// 慣性
let speed = 0
window.addEventListener("wheel", (event) => {
  speed += event.deltaY * 0.0002
})
// 棒の出し入れ
function rot() {
    stickMesh.position.y += speed
    speed *= 0.85
    if (stickMesh.position.y < position_min) {
        stickMesh.position.y = position_min
    } else if (stickMesh.position.y > position_max) {
        stickMesh.position.y = position_max
    }
    omikuji_logic()
    window.requestAnimationFrame(rot)
}  
rot()


// 常時レンダリングアニメーション
const animate = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)   
}
animate()

