import './App.css';
import React, { useReducer } from 'react'
import DigitBtn from './DigitBtn';
import OperationBtn from './OperationBtn';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: "0.",
        };
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.prevOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.prevOperand == null) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        currentOperand: evaluate(state),
        operation: null,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null) return state;

      if (state.currentOperand.length === 1) return { ...state, currentOperand: null };

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}

function evaluate({ currentOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand);
  const curr = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curr)) return ""

  let compute = "";

  switch (operation) {
    case "+":
      compute = prev + curr;
      break;

    case "-":
      compute = prev - curr;
      break;

    case "*":
      compute = prev * curr;
      break;

    case "/":
      compute = prev / curr;
      break;
  }

  return compute.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) {
    return;
  }

  const [integer, decimal] = operand.split('.');

  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

export default function App() {
  const [{ currentOperand, prevOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{formatOperand(prevOperand)} {operation}</div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationBtn dispatch={dispatch} operation="/" />
        <DigitBtn dispatch={dispatch} digit="1" />
        <DigitBtn dispatch={dispatch} digit="2" />
        <DigitBtn dispatch={dispatch} digit="3" />
        <OperationBtn dispatch={dispatch} operation="*" />
        <DigitBtn dispatch={dispatch} digit="4" />
        <DigitBtn dispatch={dispatch} digit="5" />
        <DigitBtn dispatch={dispatch} digit="6" />
        <OperationBtn dispatch={dispatch} operation="+" />
        <DigitBtn dispatch={dispatch} digit="7" />
        <DigitBtn dispatch={dispatch} digit="8" />
        <DigitBtn dispatch={dispatch} digit="9" />
        <OperationBtn dispatch={dispatch} operation="-" />
        <DigitBtn dispatch={dispatch} digit="." />
        <DigitBtn dispatch={dispatch} digit="0" />
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </>
  )
}

