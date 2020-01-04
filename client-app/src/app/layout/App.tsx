import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./styles.css";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activitiy";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const hadleSelectActivity = useCallback(
    (id: string) => {
      setSelectedActivity(activities.filter(a => a.id === id)[0]);
      setEditMode(false);
    },
    [activities]
  );

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
  };

  useEffect(() => {
    axios.get<IActivity[]>("http://localhost:5000/api/activities").then(r => {
      let activities: IActivity[] = [];
      r.data.forEach(a => {
        a.date = a.date.split(".")[0];
        activities.push(a);
      });
      setActivities(activities);
    });
  }, []);

  return (
    <>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ margin: "7em" }}>
        <ActivityDashboard
          selectActivity={hadleSelectActivity}
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
          activities={activities}
          editMode={editMode}
          setEditMode={setEditMode}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
};

export default App;
