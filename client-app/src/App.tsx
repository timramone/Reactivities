import React from "react";
import "./App.css";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import { Header, Icon, List } from "semantic-ui-react";

interface Value {
  id: number;
  name: string;
}

interface State {
  values: Value[];
}

class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      values: []
    };
  }

  componentDidMount() {
    axios.get<Value[]>("http://localhost:5000/api/values").then(r => {
      this.setState({
        values: r.data
      });
    });
  }

  render() {
    return (
      <div className="App">
        <Header as="h2">
          <Icon name="plug" />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {this.state.values.map(v => {
            return <List.Item key={v.id}>{v.name}</List.Item>;
          })}
        </List>
      </div>
    );
  }
}

export default App;
