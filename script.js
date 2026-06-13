/* =============================
PLACEHOLDER
=============================*/
const placeholder = {
gauss:`Contoh:
2 1 -1 8
-3 -1 2 -11
-2 1 2 -3`,

gaussSeidel:`Contoh:
10 -1 2 6
-1 11 -1 25
2 -1 10 -11`,

bisection:`Contoh:
fungsi: x^3-4*x-9
a: 2
b: 3
iterasi: 10`,

secant:`Contoh:
fungsi: x^3-4*x-9
x0: 2
x1: 3
iterasi: 10`,

newton:`Contoh:
x: 1 2 3
y: 2 3 5`,

trapesium:`Contoh:
fungsi: x^2
a: 0
b: 4
n: 4`,

runge:`Contoh:
fungsi: x+y
x0: 0
y0: 1
h: 0.1
iterasi: 5`
}


/* =============================
UBAH PLACEHOLDER
=============================*/
function ubahPlaceholder(){
const metode = document.getElementById("metode").value
// sembunyikan semua blok, tampilkan hanya yang sesuai
document.querySelectorAll('.method-block').forEach(b=>b.style.display='none')
const block = document.getElementById('block-'+metode)
if(block) block.style.display = 'block'

// tampilkan helper singkat sesuai metode
const helpMap = {
	gauss: 'Masukkan matriks augmented: tiap baris newline, tiap kolom spasi. Contoh ada di sebelah.',
	gaussSeidel: 'Masukkan matriks augmented seperti Gauss (baris newline, kolom spasi).',
	bisection: 'Isi fungsi, interval a dan b, serta jumlah iterasi.',
	secant: 'Isi fungsi, titik awal x0 & x1, serta iterasi.',
	newton: 'Masukkan daftar x dan y berpasangan, pisah dengan spasi.',
	trapesium: 'Isi fungsi, batas a dan b, dan jumlah subinterval n.',
	runge: 'Isi f(x,y), x0, y0, langkah h, dan jumlah iterasi.'
}
document.getElementById("helper").innerText = helpMap[metode] || 'Gunakan format seperti contoh di atas'
}

ubahPlaceholder()

/* =============================
MATRIX GRID UI: create, fill example, transfer
=============================*/
function populateSizeSelectors(){
    const gaussSel = document.getElementById('gauss-size')
    const gsSel = document.getElementById('gs-size')

    if(!gaussSel || !gsSel) return

    // 🔥 PENTING: reset dulu biar tidak double
    gaussSel.innerHTML = ''
    gsSel.innerHTML = ''

    for(let i=2;i<=10;i++){
        let opt1 = document.createElement('option')
        opt1.value = i
        opt1.text = `${i} Variabel`
        gaussSel.appendChild(opt1)

        let opt2 = document.createElement('option')
        opt2.value = i
        opt2.text = `${i} Variabel`
        gsSel.appendChild(opt2)
    }

    gaussSel.value = 3
    gsSel.value = 3
}

function createMatrixGrid(method){
    const isGauss = method === 'gauss'
    const size = parseInt(document.getElementById(isGauss? 'gauss-size' : 'gs-size').value)
    const container = document.getElementById(isGauss? 'gauss-grid-container' : 'gs-grid-container')
    container.innerHTML = ''

    const table = document.createElement('table')
    table.className = 'matrix-grid'
    const caption = document.createElement('caption')
caption.innerText = `Sistem Persamaan Linear (${size} Variabel)`
    table.appendChild(caption)
    const info = document.createElement('div')

info.className = 'matrix-info'

info.innerHTML = `
Jumlah Variabel : <b>${size}</b><br>
Ukuran Matriks Augmented : <b>${size} × ${size+1}</b>
`

container.appendChild(info)

    for(let i=0;i<size;i++){
        const tr = document.createElement('tr')
        for(let j=0;j<=size;j++){
            const td = document.createElement('td')
            const inp = document.createElement('input')
            inp.type = 'text'
            inp.className = `${method}-cell`
            inp.dataset.row = i
            inp.dataset.col = j
            inp.placeholder = (j===size)? 'b' : `a${i+1}${j+1}`
            td.appendChild(inp)
            tr.appendChild(td)
            if(j===size-1){
                const sep = document.createElement('td')
                sep.innerText = '|'
                sep.className = 'sep'
                tr.appendChild(sep)
            }
        }
        table.appendChild(tr)
    }

    container.appendChild(table)
}

function clearAllInputs(){

    // reset semua input text/number
    document.querySelectorAll("input").forEach(el => {
        el.value = ""
    })

    // reset semua select
    document.querySelectorAll("select").forEach(el => {
        el.selectedIndex = 0
    })

    // hapus grid matrix
    document.getElementById("gauss-grid-container").innerHTML = ""
    document.getElementById("gs-grid-container").innerHTML = ""

    // reset helper & output
    document.getElementById("helper").innerText = ""
    document.getElementById("output").innerHTML = "Hasil akan muncul disini..."

    // optional: reset error/loading
    document.getElementById("loading").style.display = "none"

    console.log("SEMUA INPUT BERHASIL DIRESET")
}

function copyResult(){
    const text = document.getElementById("output").innerText;

    if(!text || text.includes("Hasil akan muncul")){
        alert("Tidak ada hasil untuk di-copy");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => alert("Hasil berhasil di-copy"))
        .catch(() => alert("Gagal copy"));
}

function exportPDF(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const text = document.getElementById("output").innerText;

    if(!text || text.includes("Hasil akan muncul")){
        alert("Tidak ada hasil untuk diexport");
        return;
    }

    doc.setFont("courier");
    doc.setFontSize(10);

    const lines = text.split("\n");

    let y = 10;
    let linesPerPage = 40;
    let count = 0;

    lines.forEach(line => {
        if(count >= linesPerPage){
            doc.addPage();
            y = 10;
            count = 0;
        }

        doc.text(line, 10, y);
        y += 7;
        count++;
    });

    doc.save("hasil-metode-numerik.pdf");
}

function addHistory(text) {
    const container = document.getElementById("history-list");
    
    // Batasi jumlah history maksimal (misalnya 10 item)
    const maxHistory = 10;
    if (container.children.length >= maxHistory) {
        container.removeChild(container.lastChild);
    }

    const item = document.createElement("div");
    item.className = "history-item";
    item.innerText = text;

    // klik history → tampilkan lagi ke output
    item.onclick = () => {
        document.getElementById("output").innerText = text;
    };

    container.prepend(item);
}

function toggleHistory() {
  const historyBox = document.getElementById("history-list");
  if (historyBox.style.display === "none" || historyBox.style.display === "") {
    historyBox.style.display = "block";
  } else {
    historyBox.style.display = "none";
  }
}

function buildMatrixDataFromGrid(method){

    const cells =
        Array.from(
            document.querySelectorAll(`.${method}-cell`)
        )

    if(cells.length === 0){
        return ''
    }

    const rows =
        Math.max(...cells.map(c=>parseInt(c.dataset.row))) + 1

    const cols =
        Math.max(...cells.map(c=>parseInt(c.dataset.col))) + 1

    let lines = []
    let hasInput = false

    for(let i=0;i<rows;i++){

        let vals = []

        for(let j=0;j<cols;j++){

            const el = cells.find(
                c =>
                parseInt(c.dataset.row)===i &&
                parseInt(c.dataset.col)===j
            )

            let v = '0'

            if(el && el.value.trim()){

                v = el.value.trim()

                hasInput = true
            }

            vals.push(v)
        }

        lines.push(vals.join(' '))
    }

    if(!hasInput){
        return ''
    }

    return lines.join('\n')
}

function fillGaussExample(){
    const txt = placeholder.gauss
    const rows = txt.trim().split('\n')
    const n = rows.length
    document.getElementById('gauss-size').value = n
    createMatrixGrid('gauss')
    const cells = Array.from(document.querySelectorAll('.gauss-cell'))
    rows.forEach((r,i)=>{
        r.trim().split(/\s+/).forEach((v,j)=>{
            const el = cells.find(c=>parseInt(c.dataset.row)===i && parseInt(c.dataset.col)===j)
            if(el) el.value = v
        })
    })
}

function fillGaussSeidelExample(){
    const txt = placeholder.gaussSeidel
    const rows = txt.trim().split('\n')
    const n = rows.length
    document.getElementById('gs-size').value = n
    createMatrixGrid('gaussSeidel')
    const cells = Array.from(document.querySelectorAll('.gaussSeidel-cell'))
    rows.forEach((r,i)=>{
        r.trim().split(/\s+/).forEach((v,j)=>{
            const el = cells.find(c=>parseInt(c.dataset.row)===i && parseInt(c.dataset.col)===j)
            if(el) el.value = v
        })
    })
}

// Initialize selectors on DOM ready
document.addEventListener('DOMContentLoaded', function(){
    populateSizeSelectors()
})

/* =============================
UTILITAS UI
=============================*/
function tampilError(pesan){
document.getElementById("output").innerHTML = "❌ ERROR:\n" + pesan
}

function tampilLoading(status){
document.getElementById("loading").style.display =
status ? "block" : "none"
}


/* =============================
FUNGSI HITUNG (UTAMA)
=============================*/
function hitung(){
const metode = document.getElementById("metode").value
let data = ''

// build data string sesuai format yang sudah dipakai fungsi-fungsi
try{
	switch(metode){
case 'gauss':

data = buildMatrixDataFromGrid('gauss')

if(!data){
    throw 'Silakan isi matriks terlebih dahulu'
}

break

case 'gaussSeidel':

data = buildMatrixDataFromGrid('gaussSeidel')

if(!data){
    throw 'Silakan isi matriks terlebih dahulu'
}

break

		case 'bisection':{
			const f = document.getElementById('bisection-f').value.trim()
			const a = document.getElementById('bisection-a').value.trim()
			const b = document.getElementById('bisection-b').value.trim()
			const it = document.getElementById('bisection-iter').value
			if(!f||!a||!b) throw 'Lengkapi fungsi dan interval (a,b) untuk Bisection'
			data = `fungsi: ${f}\na: ${a}\nb: ${b}\niterasi: ${it}`
			break
		}

		case 'secant':{
			const f = document.getElementById('secant-f').value.trim()
			const x0 = document.getElementById('secant-x0').value.trim()
			const x1 = document.getElementById('secant-x1').value.trim()
			const it = document.getElementById('secant-iter').value
			if(!f||!x0||!x1) throw 'Lengkapi fungsi dan x0/x1 untuk Secant'
			data = `fungsi: ${f}\nx0: ${x0}\nx1: ${x1}\niterasi: ${it}`
			break
		}

		case 'newton':{
			const xs = document.getElementById('newton-x').value.trim()
			const ys = document.getElementById('newton-y').value.trim()
			if(!xs||!ys) throw 'Masukkan daftar x dan y untuk Interpolasi Newton'
			data = `x: ${xs}\ny: ${ys}`
			break
		}

		case 'trapesium':{
			const f = document.getElementById('trapesium-f').value.trim()
			const a = document.getElementById('trapesium-a').value.trim()
			const b = document.getElementById('trapesium-b').value.trim()
			const n = document.getElementById('trapesium-n').value
			if(!f||!a||!b) throw 'Lengkapi fungsi dan batas a/b untuk Trapesium'
			data = `fungsi: ${f}\na: ${a}\nb: ${b}\nn: ${n}`
			break
		}

		case 'runge':{
			const f = document.getElementById('runge-f').value.trim()
			const x0 = document.getElementById('runge-x0').value.trim()
			const y0 = document.getElementById('runge-y0').value.trim()
			const h = document.getElementById('runge-h').value.trim()
			const it = document.getElementById('runge-iter').value
			if(!f||!x0||!y0||!h) throw 'Lengkapi f, x0, y0, dan h untuk Runge Kutta'
			data = `fungsi: ${f}\nx0: ${x0}\ny0: ${y0}\nh: ${h}\niterasi: ${it}`
			break
		}

		default:
			throw 'Metode belum tersedia'
	}
}catch(err){
	tampilError(err)
	return
}

// tampilkan teks menghitung
tampilLoading(true)
document.getElementById("output").innerHTML = ""

setTimeout(()=>{
    const container = document.getElementById("history-list");
	try{
		switch(metode){
case "gauss":
    let raw = parseMatrix(data)
    let result = gaussSolve(raw)

    const hasil = "<pre>" + formatGaussResult(result) + "</pre>"

    // tampilkan ke output
    const outputEl = document.getElementById("output")
    outputEl.innerHTML = hasil

    // simpan ke history (PAKAI TEXT BUKAN HTML)
    addHistory(formatGaussResult(result))
		break
			case "bisection": metodeBisection(data); break
			case "secant": metodeSecant(data); break
			case "trapesium": metodeTrapesium(data); break
			case "runge": rungeKutta(data); break
			case "gaussSeidel": metodeGaussSeidel(data); break
			case "newton": interpolasiNewton(data); break
			default: tampilError("Metode belum tersedia")
		}
	}catch(e){
		tampilError("Format input salah: "+e)
	}

	// sembunyikan loading setelah hasil keluar
	tampilLoading(false)

},600)
}

function parseMatrix(input){
    let rows = input.split("\n").map(r => r.trim()).filter(r => r.length)

    let matrix = rows.map(r=>{
        let vals = r.split(/\s+/).map(v=>{
let num;

try {
    num = math.evaluate(v);
} catch (e) {
    throw "Input bukan angka valid: " + v;
}

if (!isFinite(num)) {
    throw "Nilai tidak valid (Infinity/NaN): " + v;
}
            return num
        })
        return vals
    })

    let cols = matrix[0].length

    if(!matrix.every(r => r.length === cols)){
        throw "Jumlah kolom tiap baris harus sama"
    }

    if(cols !== matrix.length + 1){
        throw "Harus matriks augmented (n x n+1)"
    }

    if(matrix.length > 10){
        throw "Maksimal ukuran matriks adalah 10x10"
    }

    return matrix
}

function formatNumber(v){
    // hilangkan noise kecil (floating error)
    if(Math.abs(v) < 1e-10) return "0"

    // kalau bilangan bulat → tampilkan tanpa desimal
    if(Number.isInteger(v)) return v.toString()

    // kalau desimal → batasi tapi tidak dipaksa
    return parseFloat(v.toFixed(6)).toString()
}

function formatMatrix(mat){
    return mat.map(r=>{
        let left = r.slice(0,-1).map(formatNumber).join("\t")
        let right = formatNumber(r[r.length-1])
        return `[ ${left} | ${right} ]`
    }).join("\n")
}

function formatGaussResult(res){

    let out = "=== ELIMINASI GAUSS ===\n\n"

    res.steps.forEach((s,i)=>{
        out += `Langkah ${i+1}:\n`
        out += s.desc + "\n"
        out += formatMatrix(s.matrix) + "\n\n"
    })

    out += "=== ANALISIS ===\n"

    if(res.type === "no-solution"){
        out += "❌ Sistem tidak memiliki solusi\n"
        out += "Terjadi inkonsistensi (0 = c)\n"
        return out
    }

    if(res.type === "infinite"){
        out += "♾️ Sistem memiliki banyak solusi\n"
        out += "Terdapat variabel bebas\n\n"
    }

    if(res.type === "unique"){
        out += "✅ Sistem memiliki solusi unik\n\n"
    }

    out += "=== HASIL ===\n"
    res.solution.forEach((v,i)=>{
        out += `x${i+1} = ${v}\n`
    })

    return out
}

function safeEval(expr, scope = {}) {
    try {
        return math.evaluate(expr, scope);
    } catch (e) {
        throw "Ekspresi tidak valid: " + expr;
    }
}

function gaussSolve(matrixInput, epsilon = 1e-10){

    let M = matrixInput.map(r => [...r])
    let n = M.length
    let steps = []

    function cloneMatrix(mat){
        return mat.map(r => [...r])
    }

    function log(desc){
        steps.push({
            desc,
            matrix: cloneMatrix(M)
        })
    }

    function isZeroRow(row){
        return row.every(v => Math.abs(v) < epsilon)
    }

    function getRank(mat){
        let rank = 0
        for(let i=0;i<mat.length;i++){
            if(!isZeroRow(mat[i])) rank++
        }
        return rank
    }

    log("Matriks awal")

    // =============================
    // FORWARD ELIMINATION (Gaya Buku)
    // =============================
    for(let k=0;k<n;k++){

        // =============================
        // 1. PILIH PIVOT (Partial Pivoting)
        // =============================
        let maxRow = k
        for(let i=k+1;i<n;i++){
            if(Math.abs(M[i][k]) > Math.abs(M[maxRow][k])){
                maxRow = i
            }
        }

        // jika semua nol → lanjut (nanti ditangani di rank)
        if(Math.abs(M[maxRow][k]) < epsilon){
            log(`Kolom ${k+1} tidak memiliki pivot (semua nol)`)
            continue
        }

        // =============================
        // 2. TUKAR BARIS
        // =============================
        if(maxRow !== k){
            [M[k], M[maxRow]] = [M[maxRow], M[k]]
            log(`Tukar baris B${k+1} dengan B${maxRow+1}`)
        }

        // =============================
        // 3. NORMALISASI PIVOT (BIAR = 1)
        // =============================
        let pivot = M[k][k]
        for(let j=k;j<=n;j++){
            M[k][j] /= pivot
        }
        log(`Normalisasi baris B${k+1} (pivot jadi 1)`)

        // =============================
        // 4. ELIMINASI KE BAWAH
        // =============================
        for(let i=k+1;i<n;i++){
            let factor = M[i][k]

            if(Math.abs(factor) < epsilon) continue

            for(let j=k;j<=n;j++){
                M[i][j] -= factor * M[k][j]
            }

            log(`B${i+1} = B${i+1} - (${factor.toFixed(4)}) × B${k+1}`)
        }
    }

    // =============================
    // CEK JENIS SOLUSI (RANK)
    // =============================
    let A = M.map(r => r.slice(0,n))
    let rankA = getRank(A)
    let rankAug = getRank(M)

    if(rankA !== rankAug){
        return {
            steps,
            type: "no-solution",
            solution: []
        }
    }

    if(rankA < n){
        return {
            steps,
            type: "infinite",
            solution: []
        }
    }

    // =============================
    // BACK SUBSTITUTION (Gaya Buku)
    // =============================
    let x = new Array(n).fill(0)

    for(let i=n-1;i>=0;i--){
        let sum = M[i][n]

        for(let j=i+1;j<n;j++){
            sum -= M[i][j] * x[j]
        }

        if(Math.abs(M[i][i]) < epsilon){
            throw "Pivot nol saat back substitution"
        }

        x[i] = sum / M[i][i]

        log(`x${i+1} = ${x[i].toFixed(6)}`)
    }

    return {
        steps,
        type: "unique",
        solution: x.map(v => +v.toFixed(6))
    }
}

/* =============================
GAUSS SEIDEL
=============================*/
function metodeGaussSeidel(data){

    // =============================
    // PARSING INPUT
    // =============================
    let lines = data.split("\n").map(r=>r.trim()).filter(r=>r.length)

    let A = lines.map(r =>
        r.split(/\s+/).map(v => safeEval(v))
    )

    let n = A.length

    // =============================
    // SESUAI CATATAN DOSEN
    // initial guess: (1,2,2,...)
    // =============================
    let x = []
    for(let i=0;i<n;i++){
        x.push(i+1) // 1,2,3,... sesuai pola catatan
    }

    let epsilon = 0.3   // SESUAI TUGAS DOSEN
    let maxIter = 50

    let output = "=== METODE GAUSS-SEIDEL (VERSI SESUAI CATATAN DOSEN) ===\n\n"

    function safeDiv(a,b){
        if(Math.abs(b) < 1e-12){
            throw "Pembagi nol terdeteksi (diagonal matrix invalid)"
        }
        return a / b
    }

    for(let it=1; it<=maxIter; it++){

        let xOld = [...x]
        let errorMax = 0

        output += `Iterasi ${it}\n`
        output += `Solusi awal: (${x.map(v=>v.toFixed(2)).join(", ")})\n`

        // =============================
        // RUMUS GAUSS-SEIDEL (SESUAI CATATAN)
        // xi = (bi - Σ aij*xj) / aii
        // =============================
        for(let i=0;i<n;i++){

            let sum = A[i][n]

            for(let j=0;j<n;j++){
                if(j !== i){
                    sum -= A[i][j] * x[j]
                }
            }

            let xi = safeDiv(sum, A[i][i])

            // error relatif (SESUI CATATAN DOSEN)
            let err = Math.abs((xi - x[i]) / (xi || 1))

            x[i] = xi
            errorMax = Math.max(errorMax, err)

            output += `x${i+1} = ${xi.toFixed(6)} | error = ${err.toFixed(4)}\n`
        }

        output += `Max error = ${errorMax.toFixed(4)}\n\n`

        // =============================
        // STOP CONDITION (SESUI DOSEN: ε = 0.3)
        // =============================
        if(errorMax < epsilon){
            output += "✔ KONVERGEN (STOP karena error < 0.3)\n\n"
            break
        }
    }

    // =============================
    // HASIL AKHIR
    // =============================
    output += "=== HASIL AKHIR ===\n"
    x.forEach((v,i)=>{
        output += `x${i+1} = ${v.toFixed(6)}\n`
    })

    document.getElementById("output").innerHTML = output
}

/* =============================
BISECTION
=============================*/
function metodeBisection(data){

let lines = data.split("\n")

let f = lines[0].split(":")[1].trim()
let a = parseFloat(lines[1].split(":")[1])
let b = parseFloat(lines[2].split(":")[1])
let iter = parseInt(lines[3].split(":")[1])

function fx(x){
    let val = safeEval(f,{x})
    if(!isFinite(val)) throw "Fungsi tidak valid di x=" + x
    return val
}

// VALIDASI AWAL
let fa = fx(a)
let fb = fx(b)

if(fa * fb > 0){
    throw "Interval tidak valid: f(a) dan f(b) harus beda tanda"
}

let output = "=== METODE BISECTION (INDUSTRI VERSION) ===\n\n"

let c = 0

for(let i=1;i<=iter;i++){

    c = (a + b) / 2
    let fc = fx(c)

    output += `Iterasi ${i}\n`
    output += `a=${a} b=${b} c=${c}\n`
    output += `f(a)=${fa} f(b)=${fb} f(c)=${fc}\n`

    if(Math.abs(fc) < 1e-8){
        output += "✔ AKAR DITEMUKAN (exact)\n"
        break
    }

    if(fa * fc < 0){
        b = c
        fb = fc
    } else {
        a = c
        fa = fc
    }

    output += "\n"
}

output += `=== HASIL AKHIR ===\nAkar ≈ ${c}\n`

document.getElementById("output").innerHTML = output
}

/* =============================
SECANT
=============================*/

/* =============================
TRAPESIUM
=============================*/

/* =============================
RUNGE KUTTA
=============================*/

/* =============================
SPLASH SCREEN
=============================*/
setTimeout(()=>{
document.getElementById("splash").style.display="none"
},3000)

// =============================
// FIX GLOBAL SCOPE
// =============================
window.hitung = hitung
window.gaussSolve = gaussSolve
window.metodeBisection = metodeBisection
window.metodeSecant = metodeSecant
window.metodeTrapesium = metodeTrapesium
window.rungeKutta = rungeKutta
window.metodeGaussSeidel = metodeGaussSeidel
window.interpolasiNewton = interpolasiNewton

// =============================
// PASTIKAN DOM READY
// =============================
document.addEventListener("DOMContentLoaded", function(){

    populateSizeSelectors()

    createMatrixGrid('gauss')
    createMatrixGrid('gaussSeidel')

    ubahPlaceholder()
})

function toggleTutorial(){
    const modal = document.getElementById("tutorialModal")
    modal.classList.toggle("active")
}