async function process_argv() {
    const argv = process.argv.slice(2);
    const result = await studentActivitiesRegistration(argv);
    return result;
  }

async function getStudentActivities() {
    const res = await fetch('http://localhost:3001/activities');
    const data = await res.json();
    return data.map(value => ({
      id: value.id,
      name: value.name,
      desc: value.desc,
      days: value.days
    }));
  }
  
  async function studentActivitiesRegistration(data) {
    if (data[0] === 'CREATE') {
      const activities = await getStudentActivities();
      const getActivitiesByFilter = activities.filter(value => value.days.includes(data[2]));
  
      const newData = {
        name: data[1],
        activities: getActivitiesByFilter.map(value => ({
          name: value.name,
          desc: value.desc,
        })),
      };
  
      const res = await fetch('http://localhost:3001/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData),
      });
  
      const datas = await res.json();
  
      return {
        id: datas.id,
        name: datas.name,
        activities: datas.activities.map(activity => ({ name: activity.name, desc: activity.desc }))
      };
    } else if (data[0] === 'DELETE') {
      await fetch(`http://localhost:3001/students/${data[1]}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      return { message: `Successfully deleted student data with id ${data[1]}` };
    }
  }
  
  async function addStudent(name, day) {
    const activities = await getStudentActivities();
    const getActivitiesByFilter = activities.filter(value => value.days.includes(day));
  
    const newStd = {
      name: name,
      activities: getActivitiesByFilter.map(value => ({
        name: value.name,
        desc: value.desc
      }))
    };
  
    const res = await fetch('http://localhost:3001/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStd),
    });
  
    const data = await res.json();
  
    return {
      id: data.id,
      name: data.name,
      activities: data.activities.map(activity => ({ name: activity.name, desc: activity.desc }))
    };
  }
  
  async function deleteStudent(id) {
    await fetch(`http://localhost:3001/students/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    return { message: `Successfully deleted student data with id ${id}` };
  }
  
  process_argv()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  
  module.exports = {
    studentActivitiesRegistration,
    getStudentActivities,
    addStudent,
    deleteStudent
  };  