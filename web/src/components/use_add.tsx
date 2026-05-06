import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";

type User = {
  id: number
  name: string
  age: number
}

function App() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "hoda", age: 21 },
    { id: 2, name: "ali", age: 23 },
  ])
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const addUser = () => {
    const trimmedName = name.trim()
    const parsedAge = Number(age)

    if (!trimmedName || Number.isNaN(parsedAge) || parsedAge <= 0) {
      return
    }

    setUsers((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((user) => user.id)) + 1 : 1,
        name: trimmedName,
        age: parsedAge,
      },
    ])
    setName("")
    setAge("")
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="overflow-hidden bg-white shadow-sm">
          <CardHeader className="gap-4 px-6 py-5 md:flex md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Add New User</CardTitle>
            </div>
            <div className="grid w-full gap-3 md:max-w-md md:grid-cols-2">
              <Input
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(event) => setAge(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2 px-6 py-4">
            <Button onClick={addUser} className="w-full md:w-auto">
              Add User
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {users.map((user) => (
            <Card key={user.id} className="bg-slate-900 text-slate-100">
              <CardHeader>
                <CardTitle className="text-white">{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">Age: {user.age}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App;
