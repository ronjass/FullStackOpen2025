const Notification = ({ info }) => {
    if (info === null) {
      return null
    }

    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1
      }
  
    return (
      <div style={style}>
        {info}
      </div>
    )
  }

export default Notification