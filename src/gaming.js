// I am allowed to be inefficent, this is a joke project
function updateHTML(){
    for (let i = 0; i < data.numbers.length; i++) {
        DOM(`number${i}`).innerText = `Your Number ${i>0?i+1:''} is ${formatWhole(data.numbers[i])}${i>0?`, raising Number ${i} gain to the ${format(calcNumberBoost(i))}`:''} `
    }
}

function loadHTML(){
    if(data.thingClicked) DOM('help').style.display = 'none'

    const container = DOM('genContainer')
    const rows = []
    for (let i = 0; i < data.numbers.length; i++) {
        let row = document.createElement('div')
        row.className = `row`
        row.id = `row${i}`
        container.append(row)
        rows.push(row)

        let number = document.createElement('strong')
        number.className = `centeredTexts`
        number.id = `number${i}`
        DOM('numContainer').append(number)    
    }

    let total = 0
    for (let i = 0; i < rows.length; i++){
        for (let j = 0; j < 7; j++) {
            let gen = document.createElement('button')
            gen.className = `gen`
            gen.id = `gen${total}`
            gen.innerText = `Generator ${total+1} (${format(data.manuals[total])})\n Produces ${total>0? `Generator ${total}` : `Number ${i+1}`}\n${format(calcCost(total))} Number ${i+1}`
    
            rows[i].append(gen)
            ++total            
        }
        let ba = document.createElement('button')
        ba.className = `gen`
        ba.id = `ba${i}`
        ba.innerText = `Attempt to Buy 1 of All Row ${i+1} Generators`
        ba.addEventListener('click', ()=>buyGenRow(i))
        rows[i].append(ba)
    }

    for (let i = 0; i < data.generators.length; i++) {
        DOM(`gen${i}`).addEventListener('click', ()=>buyGen(i))
    }

    data.thingClicked = true
    DOM('help').style.display = 'none'
}

let calcCost = (i) => D(10).pow(data.manuals[i].plus(1)).times(D(i+1))

function buyGen(i, bypass=false){
    let r = Math.floor((i+1)/7)
    let ur = (i+1)%7 == 0 ? r-1 : r

    if((i+1)%7 == 0 && data.generators[i] == 0 && i > 0 && !bypass && data.numbers[ur].gte(calcCost(i))){

        let number = document.createElement('strong')
        number.className = `centeredTexts`
        number.id = `number${r}`
        DOM('numContainer').append(number)    
        data.numbers.push(D(0))

        let row = document.createElement('div')
        row.className = `row`
        row.id = `row${r}`
        DOM(`genContainer`).append(row)

        const rowHTML = DOM(`row${r}`)

        for (let j = 0; j < 7; j++) {
            data.generators.push(new Decimal(0))
            data.manuals.push(new Decimal(0))
            let gen = document.createElement('button')
            gen.className = `gen`
            gen.id = `gen${j+(7*r)}`
            gen.innerText = `Generator ${(j+1)+(7*r)} (${format(data.manuals[i])})\n Produces ${j>0? `Generator ${j+(7*r)}` : `Number ${r+1}`}\n${format(calcCost(j+(7*r)))} Number ${r+1}`
            gen.addEventListener('click', ()=>buyGen(j+(7*r)))
            rowHTML.append(gen)
        }
        let ba = document.createElement('button')
        ba.className = `gen`
        ba.id = `ba${r}`
        ba.innerText = `Attempt to Buy 1 of All Row ${r+1} Generators`
        ba.addEventListener('click', ()=>buyGenRow(r))
        rowHTML.append(ba)

        data.numbers[data.numbers.length-1] = calcCost(data.generators.length-7)
        
        buyGen(i, true)
    }

    if(data.numbers[ur].gte(calcCost(i))){ 
        data.numbers[ur] = data.numbers[ur].sub(calcCost(i))
        data.generators[i] = data.generators[i].plus(1)
        data.manuals[i] = data.manuals[i].plus(1)
        DOM(`gen${i}`).innerText = `Generator ${i+1} (${format(data.manuals[i])})\n Produces ${i>0? `Generator ${i}` : `Number ${ur+1}`}\n${format(calcCost(i))} Number ${ur+1}`
    }
}

function produceGenRow(r, diff){
    for (let i = 1; i < 7; i++) {
        const index = i+(7*r)
        data.generators[index-1] = data.generators[index-1].plus((calculateGain(i+(7*r)).plus(1).log10()).times(diff))
    }
}

function buyGenRow(r){
    for (let i = 6; i > -1; i--){
        const index = i+(7*r)
        console.log(index)
        buyGen(index)
    }
}

let calcNumberBoost = (i) => data.numbers[i] !== undefined ? Decimal.max(1, data.numbers[i].plus(1).log10().sqrt()) : D(1)