import { createGlobalStyle } from 'styled-components';
import { mobileBreakpoint } from './Styles';

export const BootstrapStyles = createGlobalStyle`
form {
  .form-group {
    &.oneLine {
      display: flex;
      align-items: baseline;
      justify-content: space-between;

      label {
        margin-bottom: 0;
        white-space: nowrap;
        margin-right: 0.5rem;
      }
    }
  }

  .valueSelector {
    .btn-group {
      margin-right: 0.25rem;
      margin-bottom: 0.25rem;
    }
  }
}

.card-header,
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .alert {
    flex-grow: 1;
    margin-right: 1rem;
    margin-bottom: 0;
  }

  button {
    flex-grow: 0;
  }
}

.card-title {
  font-weight: bold;
  margin-bottom: 0;

  & + .card-subtitle {
    margin-top: 0.5rem;
  }
}

.card-subtitle {
  font-weight: 300;
  font-size: 85%;
  @media (min-width: ${mobileBreakpoint}) {
    font-size: 100%;
  }
}

.card-body > dl:last-child {
  margin-bottom: 0;
}

  @media (min-width: ${mobileBreakpoint}) {
    .card + .card {
      margin-top: 1rem;
    }
  }
`;
