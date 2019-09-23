import React from 'react';
import { Progress } from 'reactstrap';
import styled from 'styled-components';

const LoadingP = styled.p`
  margin-bottom: 0;
  text-align: center;
`;

export const Loading = ({ text }: { text?: string }) => (
  <div className="loading">
    <LoadingP>
      <small>
        <em>{text || 'Loading ...'}</em>
      </small>
    </LoadingP>
    <Progress striped value={50} />
  </div>
);
