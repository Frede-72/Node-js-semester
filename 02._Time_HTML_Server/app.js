const express = require("express");
const app = express();
app.use(express.json());

const dateFormat = { year: "numeric" , month: "long" , weekday: "long" , day: "numeric" };
const gestationDays = 30;
const litterSize = 6;
const maturitydays = 180;
const lifespanDays = 2880;

app.get("/" , (req, res) =>{ 
    res.sendFile(__dirname + "/index.html");
});

app.post("/api/date" , (req, res) =>{
    const initialRabbitPairs = req.body.rabbitPairs;
    const targetRabbits = req.body.targetRabbits;
    const date = new Date(req.body.date);
    let rabbits = BigInt(initialRabbitPairs*2);
    let daysSinceStart = gestationDays;
    let currentRabbitPairs = BigInt(initialRabbitPairs);
    let rabbitGrowthPerMonth = [];

    if(!initialRabbitPairs || !targetRabbits){
        res.send( {error: ":("});
        return;
    }

    if(initialRabbitPairs <= 0){
        res.send({ data: "you dont have any rabbits :/"});
        return;
    }

    if(initialRabbitPairs * 2 > targetRabbits){
        res.send({data: `Please do not murder the rabbits`})
        return;
    }

    if(initialRabbitPairs * 2 === Number(targetRabbits)){
        res.send({data: `you currently have exactly ${targetRabbits} rabbits`})
        return;
    }

    while(rabbits < targetRabbits){
        if(daysSinceStart < maturitydays){
        const newRabbits = BigInt(currentRabbitPairs * BigInt(litterSize));
        rabbits += newRabbits;
        rabbitGrowthPerMonth.push(newRabbits);
        daysSinceStart+=gestationDays;
        } else if(daysSinceStart >= maturitydays){
            if(daysSinceStart === lifespanDays){
                currentRabbitPairs -= BigInt(initialRabbitPairs*2);
            } else if(daysSinceStart > lifespanDays){
                currentRabbitPairs -= rabbitGrowthPerMonth[((daysSinceStart-lifespanDays)/30)]/BigInt(2);
            }
            currentRabbitPairs += rabbitGrowthPerMonth[((daysSinceStart-maturitydays)/30)]/BigInt(2);
            const newRabbits = currentRabbitPairs * BigInt(litterSize);
            rabbits += newRabbits;
            rabbitGrowthPerMonth.push(newRabbits);
            daysSinceStart+=gestationDays;
        }
    }


    const currentDate = new Date(date).setDate(Number (daysSinceStart) + Number( new Date(date).getDate()));
    res.send({ data: new Date(currentDate).toLocaleString("en-uk" , dateFormat) })
});

app.listen(8080, (error) => {
    if(error){
        console.log(error);
    }
    console.log("Server runnning on port:" , 8080);
});