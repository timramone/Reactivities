import React from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activitiy";

interface Props {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

const ActivityList: React.FC<Props> = ({
  activities,
  selectActivity,
  deleteActivity
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(a => {
          return (
            <Item key={a.id}>
              <Item.Content>
                <Item.Header as="a">{a.title}</Item.Header>
                <Item.Meta>{a.date}</Item.Meta>
                <Item.Description>
                  <div>{a.description}</div>
                  <div>
                    {a.city}, {a.venue}
                  </div>
                </Item.Description>
                <Item.Extra>
                  <Button
                    floated="right"
                    content="view"
                    color="blue"
                    onClick={() => selectActivity(a.id)}
                  />
                  <Button
                    floated="right"
                    content="delete"
                    color="red"
                    onClick={() => deleteActivity(a.id)}
                  />
                  <Label basic content={a.category} />
                </Item.Extra>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </Segment>
  );
};

export default ActivityList;
