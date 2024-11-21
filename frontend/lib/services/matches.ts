export async function fetchDataEventsInSchedule(id: number): Promise<any> {
    try {
        const response = await fetch("http://localhost:8080/schedule",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "id": id }),
            }
        );
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

function transformData(data: any): { id: number, homeTeam: string, awayTeam: string, date: string }[] {
    return data.schedules.map((schedule: any) => ({
        id: schedule.id,
        homeTeam: schedule.home_team,
        awayTeam: schedule.away_team,
        date: new Date(schedule.date_event).toISOString().split('T')[0]
    }));
}
