const User = require("../Models/userModel");

module.exports.getTodoHome = async(req, res) => {
  const userId = req.userId;
    try {
        const user = await User.findById(userId).populate('tasks');
        res.render("home", {
          tasks: user.tasks.sort((a, b) => b.priority - a.priority),
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error getting tasks');
    }

    
}

module.exports.postAddToken = async (req, res) => {

  
    const { task, priority } = req.body;
    const userId = req.userId;
    try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { tasks: { task, priority } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
        const taskList = user.tasks.sort((a, b) => b.priority - a.priority);
        res.status(200).json({ taskList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors:  'Server error' });
  }
};

module.exports.putUpdateStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    try {
        const updatedTask = await User.findOneAndUpdate(
            { _id: userId, "tasks._id": taskId },
            { $set: { "tasks.$.status": status } },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).send("Task not found");
        }
        res.status(200).send({ updatedTask: updatedTask.tasks.id(taskId) });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update task status");
    }
};

module.exports.getReportData = async(req, res) => {

  const userId = req.userId;

  try {
    const { tasks } = await User.findById(userId).populate('tasks');
    const pendingCount = tasks.filter(task => task.status === 'pending').length;
    const canceledCount = tasks.filter(task => task.status === 'canceled').length;
    const deletedCount = tasks.filter(task => task.status === 'deleted').length;
    const completedCount = tasks.filter(task => task.status === 'completed').length;
    const data = {
    tasks,
    pendingCount,
    canceledCount,
    deletedCount,
    completedCount,
  };
  res.render('report', data)
  } catch (error) {
    console.error(error);
  }


  
};

module.exports.getAllTasks = async (req, res) => {
  const userId = req.userId;
  try {
    const { tasks } = await User.findById(userId).populate('tasks');
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);    
  }
};