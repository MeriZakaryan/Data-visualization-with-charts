function Day(number, duration, pulse, maxpulse, temperature, calories){
    this.week = number;
    this.duration = duration;
    this.pulse = pulse;
    this.maxpulse = maxpulse;
    this.temperature = temperature;
    this.calories = calories;
}

async function getData(){
    let fitness_data = [];
    await fetch("fitness_data.csv")
    .then((data) => data.text())
    .then(function(result){
        const rows = result.split('\n');
        let statistics = rows.slice(1);
        statistics = statistics.map(res => res.split(','));
  
        statistics.forEach( function(elem){
            for(let i = 0; i < elem.length; i++){
                elem[i] = +elem[i];            
            }

            fitness_data.push(new Day(...elem));
        })
    })
    return fitness_data;
}

function dataByMonths(data){
    const monthlyData = [];
   
    data.forEach(session => {
        const month = Math.ceil(session.week / 4);
        // console.log(!monthlyData[month]);
        if (!monthlyData[month]) {
            monthlyData[month] = [];
        }
        
        monthlyData[month].push(session);
    });
    
    monthlyData.shift();

    return monthlyData;
}

getData().then(function(result){
    let dataMonthly = dataByMonths(result);
    // console.log(dataMonthly);
    const randomIndex = Math.floor(Math.random() * dataMonthly.length);    
    let randomMonth = dataMonthly[randomIndex];
    let monthlyPulse = randomMonth.map(day => +day.pulse);
    let monthlyMaxPulse = randomMonth.map(day => +day.maxpulse);
    let monthlyCalorie = randomMonth.map(day => +day.calories);
    let monthlySession = randomMonth.map(day => +day.duration);

        
    const monthlyRate = document.getElementById('heart-rate-monthly');
    heartRateDemonstration(monthlyRate, monthlyPulse, monthlyMaxPulse,  monthlySession, `Month ${randomIndex + 1}`);
    
    const monthCalorieBurn = document.getElementById('month-calorie');
    label2 = `Calorie burn during month ${randomIndex + 1}`;
    calorieBurn(monthCalorieBurn, label2, monthlyCalorie, monthlySession);
    
})

getData().then(function(res) {    
    let weeks = res.map(elem => String(elem.week));
    weeks = Array(...new Set(weeks))
    // console.log(res);
    let duration = weeks.map(week => {
        let weekData = res.filter(elem => elem.week === +week);
        let meanDuration = weekData.reduce((sum, elem) => sum + elem.duration, 0) / weekData.length;
        
        return meanDuration;
    });
    let weekly_calories = weeks.map(week => {
        let weekData = res.filter(elem => elem.week === +week);
        let meanCalorie = weekData.reduce((sum, elem) => sum + elem.calories, 0) / weekData.length;
        
        return meanCalorie;
    });

    const randomIndex = Math.floor(Math.random() * res.length);    
    
    let randomWeekData = res.filter(elem => +elem.week === res[randomIndex].week)
    let duringweekCal = randomWeekData.map(week => +week.calories);
    let sessionDuration = randomWeekData.map(week => +week.duration);
    let duringWeekPulse = randomWeekData.map(week => +week.pulse);
    let duringWeekMaxPulse = randomWeekData.map(week => +week.maxpulse);
    
    weekDur(weeks, duration);
    duringWeekSession(sessionDuration, res[randomIndex].week);
    dailyColorieBurn(res[randomIndex].calories);
    sessionColorieBurn(duringweekCal, sessionDuration, res[randomIndex].week);

    const label1 = 'Calorie burn during 3 months';
    const weekColorie = document.getElementById("week-calorie");
    calorieBurn(weekColorie, label1, weekly_calories, weeks);

    const weeklyRate = document.getElementById('heart-rate-weekly');
    heartRateDemonstration(weeklyRate, duringWeekPulse, duringWeekMaxPulse,  sessionDuration, `Week ${res[randomIndex].week}`);

    // console.log(res[randomIndex].week);
});



function weekDur(weekNum, time){
    const weekChart = document.getElementById('week-duration');

    new Chart(weekChart, {
    type: 'bar',
    data: {
        labels: weekNum,
        datasets: [{
            label: 'Average duration of sessions during the week',
            data: time,
            backgroundColor: 'rgba(237, 156, 113, 1)',
            borderColor: 'rgba(156, 104, 77, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                        callback: function(value) {
                            return value + 'm';
                        }
            }
            }
    }}
    });
}

function duringWeekSession(time_dur, num){
    const sessionChart = document.getElementById('session-duration');
    const averageDur = time_dur.reduce((sum, elem) => sum + elem, 0) / time_dur.length
    let text = document.getElementById('session-info').innerText;
    text += `The average session duration of the week ${num} is ${averageDur} min`;
    document.getElementById('session-info').innerText = text;

    new Chart(sessionChart, {
        type: 'bar',
        data: {
            labels: [1, 2, 3, 4],
            datasets: [{
                label: `Duration of the sessions during the week ${num}`,
                data: time_dur,
                backgroundColor: 'rgba(237, 156, 113, 1)',
                borderColor: 'rgba(156, 104, 77, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                            callback: function(value) {
                                return value + 'm';
                            }
                }
                }
        }}
        });
}

function dailyColorieBurn(calorie){
    let text = document.getElementById('calorie-info').innerText
    text += ` ${calorie}kcal / 500kcal`;
    document.getElementById('calorie-info').innerText = text;
    
    const caloryBurn = document.getElementById('calorieburn');
    new Chart(caloryBurn , {
        type: 'doughnut',
        data: {
            labels: [
            'Calorie Burn',
            'Maximum Calorie Burn',
            ],
            datasets: [{
            label: 'Calorie burn during session',
            data: [calorie, 500],
            backgroundColor: [
                'rgba(194, 50, 87, 1)',
                'rgba(156, 151, 149, 1)',
            ],
            hoverOffset: 4
            }]
      }
    })
}

function calorieBurn (item, text, weekly_calories, week){
    new Chart(item, {
        type: 'line',
        data: {
            labels: week,
            datasets: [{
            label: text,
            data: weekly_calories,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
            }]},
        options: {
        scales: {
        y: {
            beginAtZero: true,
            ticks: {
                    callback: function(value) {
                        return value + 'kcal';
                    }
                }
            }
        }}
      })
}

function sessionColorieBurn (kcals, session, weekNum){
    const averageCalorie = kcals.reduce((sum, elem) => sum + elem, 0) / kcals.length
    const sessionColorie = document.getElementById("session-calorie");
    let text = document.getElementById('detailed-info').innerText;
    text += `The average calorie burn of the week ${weekNum} is ${averageCalorie.toFixed(2)} kcal`;
    document.getElementById('detailed-info').innerText = text
    
    new Chart(sessionColorie, {
        type: 'bar',
        data: {
            labels: session,
            datasets: [{
            label: `Average calorie burn during the week ${weekNum}`,
            data: kcals,
            fill: false,
            backgroundColor: ['#721121','#8e4a49'],
            tension: 0.1
            }]},
        options: {
            scales: {
            x: {
                ticks: {
                        callback: function(value) {                            
                            return this.getLabelForValue(value) + 'min';
                        }
                    }
                },    
            y: {
                beginAtZero: true,
                ticks: {
                        callback: function(value) {
                            return value + 'kcal';
                        }
                    }
                }
            }}
      })
}

function heartRateDemonstration(item, pulseData, maxpulseData, sessionTime, num){
    new Chart(item, {
        type: 'line',
        data:  { 
            labels: sessionTime,
            datasets: [
            {
                label: 'Max pulse rate',
                data: maxpulseData,
                borderColor: "rgba(168, 14, 14, 0.8)",
                backgroundColor: "rgba(168, 14, 14, 0.8)",
            },
            {
                label: 'Average pulse rate',
                data: pulseData,
                backgroundColor: "rgba(14, 78, 189, 0.8)",
                borderColor: "rgba(14, 78, 189, 0.8)",
            }
            ]
        },
        options: {
        responsive: true,
        plugins: {
            title: {
            display: true,
            text: `Pulse reached during each session(min): ${num}`,
        },
        scales: {
            y: {
                min: 10,
                max: 200,
            }}
        }}
    })

}
