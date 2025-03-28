import React, { useState, useEffect } from "react";
import { Ship, Percent, Save, Tag, Users, User, DollarSign, ArrowRight, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

const ManagerCharts = () => {
    // Animation state
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [ticketClasses, setTicketClasses] = useState([
        {
            id: 1,
            name: "Promo",
            basePrice: 200,
            color: "#F0C909",
            monthlySales: {
                Jan: 40, Feb: 55, Mar: 60, Apr: 70, May: 80, Jun: 65,
                Jul: 90, Aug: 85, Sep: 75, Oct: 60, Nov: 50, Dec: 45
            }
        },
        {
            id: 2,
            name: "Economy",
            basePrice: 250,
            color: "#34A792",
            monthlySales: {
                Jan: 90, Feb: 100, Mar: 110, Apr: 95, May: 105, Jun: 115,
                Jul: 120, Aug: 110, Sep: 100, Oct: 95, Nov: 85, Dec: 80
            }
        },
        {
            id: 3,
            name: "Business",
            basePrice: 350,
            color: "#C74646",
            monthlySales: {
                Jan: 25, Feb: 35, Mar: 30, Apr: 40, May: 45, Jun: 50,
                Jul: 55, Aug: 60, Sep: 50, Oct: 40, Nov: 30, Dec: 20
            }
        }
    ]);
    const [discounts, setDiscounts] = useState([
        { id: 1, name: "Student", percentage: 15, icon: Users },
        { id: 2, name: "Senior (65+)", percentage: 20, icon: User }
    ]);

    const [serviceFee, setServiceFee] = useState(10);
    const [errors, setErrors] = useState({ ticketClasses: {}, discounts: {}, serviceFee: null });
    const [saveSuccess, setSaveSuccess] = useState(false);

    const revenueAndQuantityData = months.map((month) => {
        const monthData = { month };

        let totalRevenue = 0;
        let totalQuantity = 0;

        ticketClasses.forEach((cls) => {
            const quantitySold = cls.monthlySales[month] || 0;
            const base = cls.basePrice;

            const studentQty = Math.round(quantitySold * 0.3);
            const seniorQty = Math.round(quantitySold * 0.2);
            const regularQty = quantitySold - studentQty - seniorQty;

            const studentPrice = base * (1 - 0.15) + serviceFee;
            const seniorPrice = base * (1 - 0.20) + serviceFee;
            const regularPrice = base + serviceFee;

            const studentRevenue = studentQty * studentPrice;
            const seniorRevenue = seniorQty * seniorPrice;
            const regularRevenue = regularQty * regularPrice;

            const totalClassRevenue = studentRevenue + seniorRevenue + regularRevenue;

            // Store revenue per class
            monthData[cls.name + " Revenue"] = parseFloat((totalClassRevenue / 32).toFixed(2));

            // Store quantity breakdown per group
            monthData[`${cls.name} Student`] = studentQty;
            monthData[`${cls.name} Senior`] = seniorQty;
            monthData[`${cls.name} Regular`] = regularQty;

            // Total quantity and revenue
            totalRevenue += totalClassRevenue;
            totalQuantity += quantitySold;
        });

        monthData["Total Revenue"] = parseFloat((totalRevenue / 32).toFixed(2));
        monthData["Total Quantity"] = totalQuantity;

        return monthData;
    });




    const maxRevenue = 5000;
    const maxQuantity = 250;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with animation */}
                <header
                    className={`mb-8 transition-all duration-700 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Charts</h1>
                    <div className="flex items-center text-gray-600">
                        <div className="h-1 w-10 bg-blue-600 mr-3"></div>
                        <p>Check the monthly revenue and the quantity of sold tickets</p>
                    </div>
                </header>
                <div className="max-w-6xl mx-auto">
                    {/* Revenue Chart Section */}
                    <div className={`mb-10 transition-all duration-700 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ticket Revenue Overview (₺)</h2>
                        <div className="w-full h-[24rem] bg-white shadow-md rounded-xl p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueAndQuantityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, maxRevenue]} tickFormatter={(value) => `₺${value}`} />
                                    <Tooltip formatter={(value) => `₺${value}`} />
                                    <Legend />
                                    <Bar dataKey="Promo Revenue" stackId="a" fill="#F0C909" />
                                    <Bar dataKey="Economy Revenue" stackId="a" fill="#34A792" />
                                    <Bar dataKey="Business Revenue" stackId="a" fill="#C74646" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Quantity Chart Section */}
                    <div className={`mb-10 transition-all duration-700 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ticket Quantity Sold Overview</h2>
                        <div className="w-full h-[24rem] bg-white shadow-md rounded-xl p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueAndQuantityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, maxQuantity]} />
                                    <Tooltip formatter={(value) => `${value} tickets`} />
                                    <Legend />

                                    {/* Promo */}
                                    <Bar dataKey="Promo Student" stackId="a" fill="#FACC15" />
                                    <Bar dataKey="Promo Senior" stackId="a" fill="#EAB308" />
                                    <Bar dataKey="Promo Regular" stackId="a" fill="#CA8A04" />

                                    {/* Economy */}
                                    <Bar dataKey="Economy Student" stackId="b" fill="#5EEAD4" />
                                    <Bar dataKey="Economy Senior" stackId="b" fill="#2DD4BF" />
                                    <Bar dataKey="Economy Regular" stackId="b" fill="#0D9488" />

                                    {/* Business */}
                                    <Bar dataKey="Business Student" stackId="c" fill="#FCA5A5" />
                                    <Bar dataKey="Business Senior" stackId="c" fill="#F87171" />
                                    <Bar dataKey="Business Regular" stackId="c" fill="#DC2626" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerCharts;