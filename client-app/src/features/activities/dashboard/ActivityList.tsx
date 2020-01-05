import React, { useContext } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import ActivityListItem from "./ActivityListItem";

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;
  return (
    <>
      {activitiesByDate.map(([date, activities]) => {
        return (
          <>
            <Label key={date} size="large" color="blue">
              {date}
            </Label>
            <Item.Group divided>
              {activities.map(activity => {
                return (
                  <ActivityListItem activity={activity} key={activity.id} />
                );
              })}
            </Item.Group>
          </>
        );
      })}
    </>
  );
};

export default observer(ActivityList);
