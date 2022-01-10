import { Fragment, useMemo, useRef, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './App.css';
import initSchema from './schema.json';
import initUISchema from './uischema.json';
import { materialCells, materialRenderers, } from '@jsonforms/material-renderers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import { makeStyles } from '@mui/styles';
import MonacoEditor from "@monaco-editor/react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Paper, Stack } from "@mui/material";
import { Generate } from '@jsonforms/core';

const initSchemaJSON = JSON.stringify(initSchema, null, 2);
const initUISchemaJSON = JSON.stringify(initUISchema, null, 2);

const useStyles = makeStyles({
  container: {
    padding: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto !important',
    display: 'block !important',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
});

const initialData = {
  name: 'Send email to Adrian',
  description: 'Confirm if you have passed the subject\nHereby ...',
  done: true,
  recurrence: 'Daily',
  rating: 3,
};

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: ratingControlTester, renderer: RatingControl },
];

const App = () => {
  const classes = useStyles();
  const [data, setData] = useState<any>(initialData);
  const [schema, setSchema] = useState<any>(initSchema);
  const [uischema, setUISchema] = useState<any>(initUISchema);
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const clearData = () => {
    setData({});
  };

  const schemaMonaco = useRef<any>(null)
  const uischemaMonaco = useRef<any>(null)
  const dataMonaco = useRef<any>(null)

  const generateFromData = () => {
    const json = JSON.stringify(Generate.jsonSchema(JSON.parse(dataMonaco.current.getValue())), null, 2);
    schemaMonaco.current.setValue(json)
  }

  const generateFromSchema = () => {
    const json = JSON.stringify(Generate.uiSchema(JSON.parse(schemaMonaco.current.getValue())), null, 2);
    uischemaMonaco.current.setValue(json)
  }

  const renderForm = () => {
    setSchema(JSON.parse(schemaMonaco.current.getValue()))
    setUISchema(JSON.parse(uischemaMonaco.current.getValue()))
    setData(JSON.parse(dataMonaco.current.getValue()))
  }

  const [viewOnly, setViewOnly] = useState<boolean>(false)

  // @ts-ignore
  const handleViewOnlyChange = (event) => {
    setViewOnly(event.target.checked);
  };

  const monacoOptions = {
    formatOnPaste: true,
  };

  // @ts-ignore
  const Title = (props) => (
    <Typography variant={'h5'} className={classes.title}>
      {props.children}
    </Typography>
  )

  return (
    <Fragment>
      <Grid container justifyContent={'center'} spacing={1} className={classes.container}>
        <Grid item sm={6}>
          <Stack direction='row' spacing={2}>
            <Title>JSON Schema</Title>
            <Button onClick={generateFromData}>Generate From Data</Button>
          </Stack>
          <div style={{ width: "600px", height: "400px" }}>
            <MonacoEditor
              language="json"
              options={monacoOptions}
              defaultValue={initSchemaJSON}
              onMount={editor => schemaMonaco.current = editor}
            />
          </div>

          <Stack direction='row' spacing={2}>
            <Title>UI Schema</Title>
            <Button onClick={generateFromSchema}>Generate From Schema</Button>
          </Stack>
          <div style={{ width: "600px", height: "400px" }}>
            <MonacoEditor
              language="json"
              options={monacoOptions}
              defaultValue={initUISchemaJSON}
              onMount={editor => uischemaMonaco.current = editor}
            />
          </div>
        </Grid>

        <Grid item sm={6}>
          <Stack direction='row' spacing={2}>
            <Title>Form</Title>
            <Button onClick={renderForm}>Render</Button>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={viewOnly} onClick={handleViewOnlyChange}/>}
                label="ViewOnly"
              />
            </FormGroup>
          </Stack>
          <Paper variant="outlined">
            <div className={classes.demoform}>
              <JsonForms
                schema={schema}
                uischema={uischema}
                data={data}
                renderers={renderers}
                cells={materialCells}
                onChange={({ errors, data }) => setData(data)}
                readonly={viewOnly}
              />
            </div>
          </Paper>

          <Stack direction='row' spacing={2}>
            <Title>Bound data</Title>
            <Button onClick={clearData}>Clear data</Button>
          </Stack>
          <div style={{ width: "600px", height: "300px" }}>
            <MonacoEditor
              language="json"
              options={monacoOptions}
              value={stringifiedData}
              onMount={editor => dataMonaco.current = editor}
            />
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
