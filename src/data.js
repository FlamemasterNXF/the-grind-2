const D = x => new Decimal(x)
//create all the variables in a data object for saving
const VERSION = "WateringAlpha1"
function getDefaultObject() {
    return {
        numbers: Array(1).fill(D(10)),
        generators: Array(7).fill(D(0)),
        manuals: Array(7).fill(D(0)),

        time: Date.now(),
        currentTab: 1,
        times: Array(3).fill(0), //min, sec, ms
        thingClicked:false
    }
}
let data = getDefaultObject()
//saving and loading
function save(){
    try{ window.localStorage.setItem('theWateringGrindDosSave', JSON.stringify(data)) }
    catch (e) {
        window.alert('Error', `Save failed.\n${e}`, 'Dang.');
        console.error(e);
    }
}
function load() {
    let savedata = JSON.parse(window.localStorage.getItem('theWateringGrindDosSave'))
    if (savedata !== undefined) fixSave(data, savedata)
    fixOldSaves()
    loadHTML()
}
//fix saves
function fixSave(main=getDefaultObject(), data) {
    if (typeof data === "object") {
        Object.keys(data).forEach(i => {
            if (main[i] instanceof Decimal) {
                main[i] = D(data[i]!==null?data[i]:main[i])
            } else if (typeof main[i]  == "object") {
                fixSave(main[i], data[i])
            } else {
                main[i] = data[i]
            }
        })
        return main
    }
    else return getDefaultObject()
}
function fixOldSaves(){
    for (let i = 0; i < data.numbers.length; i++) data.numbers[i] = D(data.numbers[i])        
    for (let i = 0; i < data.generators.length; i++) data.generators[i] = D(data.generators[i])        
    for (let i = 0; i < data.manuals.length; i++) data.manuals[i] = D(data.manuals[i])        
}

function exportSave(){
    try {
        save()
        let exportedData = btoa(JSON.stringify(data))
        const exportedDataText = document.createElement("textarea");
        exportedDataText.value = exportedData;
        document.body.appendChild(exportedDataText);
        exportedDataText.select();
        exportedDataText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(exportedDataText);
        //window.alert('Export Successful', 'Your Data has been copied to the clipboard!', 'Thanks!')
    }
    catch (e){
        //window.alert('Error', `Save export failed.\n${e}`, 'Dang.');
        console.error(e);
    }
}
function importSave(x) {
    try {
        if(x.length <= 0) {
            DOM('promptContainer').style.display = 'none'
            window.alert('Failure', 'No data found.', `Oops.`)
            return
        }
        data = Object.assign(getDefaultObject(), JSON.parse(atob(x)))
        save()
        location.reload()
    }
    catch (e){
        window.alert('Error', `Save import failed.\n${e}`, 'Dang.');
        console.error(e);
    }
}
window.setInterval(function(){
    save()
}, 10000);
//full reset
function fullReset(){
    exportSave()
    deleteSave()
}
function deleteSave(){
    window.localStorage.removeItem('theWateringGrindDosSave')
    location.reload()
}

window.onload = function () {
    try { load() } catch(e){ console.log('New Save!\nIf you\'re seeing this, welcome :)') }
}