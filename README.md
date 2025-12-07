# Variable Proximity

A React component that animates font variation settings based on cursor proximity.

## Installs

```bash
npm install motion
```

## Usage

```jsx
import VariableProximity from './VariableProximity';

const Example = () => {
  return (
    <VariableProximity
      label={'Variable Proximity'}
      className={'variable-proximity-demo'}
      fromSettings="'wght' 400, 'wdth' 100"
      toSettings="'wght' 900, 'wdth' 125"
      radius={100}
      falloff="linear"
    />
  );
};

export default Example;
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | **Required** | The text content to display. |
| `fromSettings` | `string` | **Required** | Initial font variation settings (e.g., `'wght' 400`). |
| `toSettings` | `string` | **Required** | Target font variation settings when cursor is close (e.g., `'wght' 900`). |
| `radius` | `number` | `undefined` | The radius of influence around the cursor. |
| `className` | `string` | `undefined` | CSS class for the container. |
| `containerRef` | `ref` | `undefined` | Optional ref for the container element to scope mouse tracking. |
