import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const mockData = [
    { name: 'Lun', usuarios: 4, sesiones: 3 },
    { name: 'Mar', usuarios: 6, sesiones: 4 },
    { name: 'Mie', usuarios: 8, sesiones: 6 },
    { name: 'Jue', usuarios: 7, sesiones: 5 },
    { name: 'Vie', usuarios: 10, sesiones: 8 },
    { name: 'Sab', usuarios: 12, sesiones: 9 },
    { name: 'Dom', usuarios: 15, sesiones: 11 },
];

export const ActivityChart = () => (
    <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
            <CardTitle className="text-gray-200">Actividad de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Line type="monotone" dataKey="usuarios" stroke="#646cff" strokeWidth={2} />
                        <Line type="monotone" dataKey="sesiones" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
);