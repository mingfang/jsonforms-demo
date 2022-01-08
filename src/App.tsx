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
import { Paper } from "@mui/material";

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

  const renderForm = () => {
    // @ts-ignore
    setSchema(JSON.parse(schemaMonaco.current.getValue()))
    // @ts-ignore
    setUISchema(JSON.parse(uischemaMonaco.current.getValue()))
  }

  const [viewOnly, setViewOnly] = useState<boolean>(false)

  // @ts-ignore
  const handleChange = (event) => {
    setViewOnly(event.target.checked);
  };

  return (
    <Fragment>
      <Grid
        container
        justifyContent={'center'}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={6}>
          <Typography variant={'h5'} className={classes.title}>
            JSON Schema
          </Typography>
          <div style={{ width: "600px", height: "400px" }}>
            <MonacoEditor
              language="json"
              defaultValue={useMemo(() => JSON.stringify(initSchema, null, 2), [initSchema])}
              onMount={editor => schemaMonaco.current = editor}
            />
          </div>
          <Typography variant={'h5'} className={classes.title}>
            UI Schema
          </Typography>
          <div style={{ width: "600px", height: "400px" }}>
            <MonacoEditor
              language="json"
              defaultValue={useMemo(() => JSON.stringify(initUISchema, null, 2), [initUISchema])}
              onMount={editor => uischemaMonaco.current = editor}
            />
          </div>
        </Grid>

        <Grid item sm={6}>
          <div style={{ display: 'flex', padding: '1rem' }}>
            <Button
              className={classes.resetButton}
              onClick={renderForm}
              color='primary'
              variant='contained'
            >
              Render form
            </Button>
            <FormGroup>
              <FormControlLabel control={
                <Checkbox checked={viewOnly} onClick={handleChange}/>
              } label="ViewOnly"/>
            </FormGroup>
          </div>

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

          <Typography variant={'h5'} className={classes.title}>
            Bound data
          </Typography>
          <div style={{ width: "600px", height: "300px" }}>
            <MonacoEditor
              language="json"
              value={stringifiedData}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: "off"
              }}
            />
          </div>
          <Button
            className={classes.resetButton}
            onClick={clearData}
            color='primary'
            variant='contained'
          >
            Clear data
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
