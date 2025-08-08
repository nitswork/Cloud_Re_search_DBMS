const {User} = require('./Database.js')
const getUserSignUp = async (req, res) => {
    try {
        const now = new Date();

        // Start of today
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        // Start of the week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Role-based total for all time
        const totalByRole = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        // Role-based total for today
        const todayByRole = await User.aggregate([
            { $match: { createdAt: { $gte: startOfToday } } },
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        // Role-based total for this week
        const weekByRole = await User.aggregate([
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        res.json({
            totalByRole,
            todayByRole,
            weekByRole
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user stats" });
    }
};
module.exports = { getUserSignUp };


