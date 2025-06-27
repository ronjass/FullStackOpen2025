const Notification = ({ info }) => {
    if (info === null) {
      return null
    }
  
    return (
      <div className="info">
        {info}
      </div>
    )
  }

export default Notification