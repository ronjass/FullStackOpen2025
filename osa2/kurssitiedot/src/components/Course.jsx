const Course = ({ course }) => {
    return (
      <div>
        <Header courses={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }
  
  const Header = ({ courses }) => {
    console.log(courses)
    return (
      <div>
        <h2>{courses.name}</h2>
      </div>
    )
  }
  
  const Content = ({ parts }) => {
    console.log(parts)
    return (
    <div>
      {parts.map((part) => <Part key={part.id} name={part.name} exercises={part.exercises}/>)}
    </div>
    )
  }
  
  const Part = ({ name, exercises }) => {
    console.log(name, exercises)
    return (
    <div>
      <p>{name} {exercises}</p>
    </div>
    )
  } 
  
  const Total = ({ parts }) => {
    console.log(parts)
  
    const total = parts.reduce(function(sum, part) {
    console.log(sum, part)
    return sum + part.exercises
    }, 0)
  
    return (
      <div>
        <b>total of {total} exercises</b>
      </div>
    )
  }

  export default Course