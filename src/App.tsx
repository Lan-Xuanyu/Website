import {
  FluentProvider,
  webLightTheme,
  Title1,
  makeStyles,
  tokens
} from '@fluentui/react-components'
import './App.css'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: '100vh',
    paddingTop: '80px',
    paddingLeft: '80px',
    backgroundColor: tokens.colorNeutralBackground1
  },
  title: {
    textAlign: 'left',
    fontSize: '4rem',
    fontWeight: 'bold',
    width: '100%',
    margin: '0'
  }
})

function App() {
  const styles = useStyles()

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <Title1 className={styles.title}>Lan-Website</Title1>
      </div>
    </FluentProvider>
  )
}

export default App
