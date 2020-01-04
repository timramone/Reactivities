import React from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { IActivity } from "../../app/models/activitiy";

interface Props {
  selectedActivity: IActivity;
  setSelectedActivity: (activity: IActivity | null) => void;
  setEditMode: (editMode: boolean) => void;
}

const ActivityDetails: React.FC<Props> = ({
  selectedActivity,
  setEditMode,
  setSelectedActivity
}) => {
  return (
    <Card>
      <Image
        src={`/assets/categoryImages/${selectedActivity.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{selectedActivity.title}</Card.Header>
        <Card.Meta>
          <span>{selectedActivity.date}</span>
        </Card.Meta>
        <Card.Description>{selectedActivity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={12}>
          <Button
            basic
            color="blue"
            content="Edit"
            onClick={() => setEditMode(true)}
          />
          <Button
            onClick={() => setSelectedActivity(null)}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default ActivityDetails;
