import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activitiy";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivitySotre from "../../../app/stores/activityStore";
import { RouteComponentProps, Link } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivitySotre);
  const {
    createActivity,
    activity: initialFormState,
    editActivity,
    submitting,
    loadActivity,
    cancelSelectedActivity
  } = activityStore;

  const [activity, setActivity] = useState({
    category: "",
    city: "",
    description: "",
    id: "",
    title: "",
    venue: "",
    date: ""
  });

  useEffect(() => {
    if (!match.params.id || activity.id === match.params.id) {
      return;
    }

    debugger;

    loadActivity(match.params.id).then(a => {
      initialFormState && setActivity(initialFormState);
    });
  }, [
    initialFormState,
    loadActivity,
    match.params.id,
    cancelSelectedActivity,
    activity.id
  ]);

  const handleInputChange = (field: keyof IActivity) => (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setActivity({
      ...activity,
      [field]: e.currentTarget.value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (activity.id) {
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    } else {
      createActivity({
        ...activity,
        id: uuid()
      }).then(() => history.push(`/activities/${activity.id}`));
    }
  };

  return (
    <Grid>
      <Grid.Column>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              onChange={handleInputChange("title")}
              placeholder="Title"
              value={activity.title}
            />
            <Form.TextArea
              rows={2}
              placeholder="Description"
              onChange={handleInputChange("description")}
              value={activity.description}
            />
            <Form.Input
              placeholder="Category"
              onChange={handleInputChange("category")}
              value={activity.category}
            />
            <Form.Input
              type="datetime-local"
              placeholder="Date"
              onChange={handleInputChange("date")}
              value={activity.date}
            />
            <Form.Input
              placeholder="City"
              onChange={handleInputChange("city")}
              value={activity.city}
            />
            <Form.Input
              placeholder="Venue"
              onChange={handleInputChange("venue")}
              value={activity.venue}
            />
            <Button
              loading={submitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              floated="right"
              content="Cancel"
              as={Link}
              to={`/activities/${activity.id}`}
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
