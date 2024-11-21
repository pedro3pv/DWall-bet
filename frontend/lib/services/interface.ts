import { Award, Snowflake, Swords } from "lucide-react";
import { CiFootball } from "react-icons/ci";
import { RiBasketballLine } from "react-icons/ri";
import { PiHockeyThin, PiSoccerBall } from "react-icons/pi";

export async function fetchDataInterface(): Promise<any> {
    try {
        const response = await fetch("http://localhost:8080/get-sport");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return transformData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function transformData(data: any): { icon: any, label: string, id: number }[] {
    const iconMap: { [key: string]: any } = {
        "NCAA Football": CiFootball,
        "NFL": CiFootball,
        "NCAA Men's Basketball": RiBasketballLine ,
        "NHL": PiHockeyThin,
        "UFC/MMA": Swords,
        "MLS": PiSoccerBall,
        "EPL": Award,
        "UEFACHAMP": PiSoccerBall,
        "JPN1": Snowflake,
    };

    return data.sports.map((sport: any) => ({
        icon: iconMap[sport.sport_name] || "DefaultIcon",
        label: sport.sport_name,
        id: sport.sport_id
    }));
}