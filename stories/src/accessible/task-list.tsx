import { colors } from "@atlaskit/theme";
import styled from "@emotion/styled";
import type { DroppableProvided } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import React, { Component, ReactElement } from "react";
import { borderRadius, grid } from "../constants";
import type { Task as TaskType } from "../types";
import BlurContext from "./blur-context";
import Task from "./task";

interface Props {
  tasks: TaskType[];
  title: string;
}

interface ContainerProps {
  blur: number;
}

const Container = styled.div<ContainerProps>`
  width: 300px;
  background-color: ${colors.N100};
  border-radius: ${borderRadius}px;
  filter: blur(${(props) => props.blur}px);
`;

const Title = styled.h3`
  font-weight: bold;
  padding: ${grid}px;
`;

const List = styled.div`
  padding: ${grid}px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
`;

export default class TaskList extends Component<Props> {
  render(): ReactElement {
    return (
      <Droppable droppableId="list">
        {(provided: DroppableProvided) => (
          <BlurContext.Consumer>
            {(blur: number) => (
              <Container
                ref={provided.innerRef}
                {...provided.droppableProps}
                blur={blur}
              >
                <Title>{this.props.title}</Title>
                <List>
                  {this.props.tasks.map((task: TaskType, index: number) => (
                    <Task key={task.id} task={task} index={index} />
                  ))}
                </List>
                {provided.placeholder}
              </Container>
            )}
          </BlurContext.Consumer>
        )}
      </Droppable>
    );
  }
}
