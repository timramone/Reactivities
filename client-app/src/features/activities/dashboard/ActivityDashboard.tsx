import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activitiy";
import ActivityList from "./ActivityList";
import ActivityDetails from "../../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
  activities: IActivity[];
  selectedActivity: IActivity | null;
  selectActivity: (id: string) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (id: string) => void;
}

const ActivityDashboard: React.FC<Props> = ({
  activities,
  selectActivity,
  selectedActivity,
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity
}) => {
  return (
    <Grid>
      <GridColumn width={10}>
        <ActivityList
          selectActivity={selectActivity}
          activities={activities}
          deleteActivity={deleteActivity}
        />
      </GridColumn>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            setEditMode={setEditMode}
          />
        )}
        {editMode && (
          <ActivityForm
            key={selectedActivity?.id ?? ""}
            selectedActivity={selectedActivity}
            setEditMode={setEditMode}
            createActivity={createActivity}
            editActivity={editActivity}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
