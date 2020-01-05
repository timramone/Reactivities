import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activitiy";
import agent from "../api/agent";
import * as _ from "lodash";

configure({
  enforceActions: "always"
});

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    const result = this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );

    return Object.entries(result);
  }

  groupActivitiesByDate(activities: IActivity[]) {
    return _.groupBy(activities, a => a.date.split("T")[0]);
  }

  @action loadActivities = async () => {
    if (this.activityRegistry.size > 0) return;

    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (ex) {
      console.log(ex);
    } finally {
      runInAction("load activities finally", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("set activity", () => {
          this.activity = activity;
        });
      } finally {
        runInAction("set activity finally", () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("create activity", () => {
        this.activityRegistry.set(activity.id, activity);
      });
    } catch (e) {
      console.log(e);
    } finally {
      runInAction("create activity finally", () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);
      runInAction("edit activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (e) {
      console.log(e);
    } finally {
      runInAction("edit activity finally", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
      });
    } finally {
      runInAction("delete activity finally", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };

  @action openCreateForm = () => {
    this.activity = null;
  };

  @action openEditForm = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  };

  @action cancelSelectedActivity = () => {
    this.activity = null;
  };
}

export default createContext(new ActivityStore());
