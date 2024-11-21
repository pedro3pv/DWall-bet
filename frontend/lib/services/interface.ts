import { Award, Beer, Flag, Globe, LogOut, Menu, Snowflake, Swords, Trophy } from "lucide-react";
import { CiFootball, CiBasketball } from "react-icons/ci";
import { SiF1 } from "react-icons/si";
import { IoTennisballOutline } from "react-icons/io5";

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
        "NFL": CiFootball,
        "NBA": CiBasketball,
        "LaLiga": Trophy,
        "UFC/MMA": Swords,
        "FIFA": Globe,
        "EPL": Award,
        "MLB": Beer,
        "NHL": Snowflake,
        "F1": SiF1,
        "Tennis": IoTennisballOutline
    };

    return data.sports.map((sport: any) => ({
        icon: iconMap[sport.sport_name] || "DefaultIcon",
        label: sport.sport_name,
        id: sport.sport_id
    }));
}