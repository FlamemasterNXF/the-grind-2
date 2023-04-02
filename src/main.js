function increase(diff){
  for (let i = 0; i < data.numbers.length; i++) {
    data.numbers[i] = data.numbers[i].plus((calculateGain(i*7).pow(calcNumberBoost(i+1))).times(diff))    
    produceGenRow(i, diff)
  }
}

function mainLoop(){
    let diff = (Date.now()-data.time)/1000
    data.time = Date.now()

    increase(diff)
    updateHTML()
}
calculateGain = (i) => data.generators[i].times(data.manuals[i].plus(1))

window.setInterval(function(){
    mainLoop()
    coolerTimerThingy()
}, 10);

function coolerTimerThingy() {
  if (data.times[2] >= 99) {
    if (data.times[1] >= 59) {
      data.times[0] += 1
      data.times[1] = 0
      data.times[2] = 0
    } else {
      data.times[1] += 1
      data.times[2] = 0
    }
  } else {
    data.times[2] += 1
  }

  let lookGood = data.times[1] < 10 ? '0':''
  document.getElementById("timer").innerHTML = `Current time: ${data.times[0]}:${lookGood}${data.times[1]}.${data.times[2]}`
}
