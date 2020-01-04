import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activitiy";
import { v4 as uuid } from "uuid";

interface Props {
  setEditMode: (mode: boolean) => void;
  selectedActivity: IActivity | null;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
}

const ActivityForm: React.FC<Props> = ({
  selectedActivity,
  setEditMode,
  createActivity,
  editActivity
}) => {
  const initializeForm: () => IActivity = () => {
    if (selectedActivity) {
      return selectedActivity;
    }

    return {
      category: "",
      city: "",
      description: "",
      id: "",
      title: "",
      venue: "",
      date: ""
    };
  };

  const [activity, setActivity] = useState(initializeForm);

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
      editActivity(activity);
    } else {
      createActivity({
        ...activity,
        id: uuid()
      });
    }
  };

  return (
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
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          floated="right"
          content="Cancel"
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
