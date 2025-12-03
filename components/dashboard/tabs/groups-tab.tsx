"use client"

import { useState } from "react"
import { useAppData } from "@/context/app-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Trash2, UserPlus, UserMinus } from "lucide-react"

export function GroupsTab() {
  const { groups, addGroup, removeGroup, addMemberToGroup, removeMemberFromGroup, expenses } = useAppData()
  const [groupName, setGroupName] = useState("")
  const [newMember, setNewMember] = useState<Record<string, string>>({})

  const handleAddGroup = () => {
    if (!groupName) return
    addGroup({ name: groupName, members: [] })
    setGroupName("")
  }

  const handleAddMember = (groupId: string) => {
    const member = newMember[groupId]
    if (!member) return
    addMemberToGroup(groupId, member)
    setNewMember({ ...newMember, [groupId]: "" })
  }

  // Calculate group expenses
  const getGroupExpenses = (members: string[]) => {
    return expenses.filter((e) => members.includes(e.paidBy) || e.groupMembers.some((m) => members.includes(m)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Travel Groups</h1>
        <p className="text-muted-foreground">Collaborate with travel companions</p>
      </div>

      {/* Add Group Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create New Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Group Name</Label>
              <Input
                placeholder="e.g., Europe Trip 2024"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddGroup}>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groups List */}
      {groups.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">No travel groups yet</p>
              <p className="text-xs text-muted-foreground">Create a group to start collaborating</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group) => {
            const groupExpenses = getGroupExpenses(group.members)
            const totalExpenses = groupExpenses.reduce((sum, e) => sum + e.amount, 0)

            return (
              <Card key={group.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        {group.name}
                      </CardTitle>
                      <CardDescription>
                        {group.members.length} members • ${totalExpenses.toFixed(2)} total expenses
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeGroup(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Members */}
                  <div className="space-y-2">
                    <Label className="text-sm">Members</Label>
                    {group.members.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No members yet</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {group.members.map((member) => (
                          <Badge key={member} variant="secondary" className="flex items-center gap-1">
                            {member}
                            <button
                              onClick={() => removeMemberFromGroup(group.id, member)}
                              className="ml-1 hover:text-destructive"
                            >
                              <UserMinus className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Member */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add member name"
                      value={newMember[group.id] || ""}
                      onChange={(e) => setNewMember({ ...newMember, [group.id]: e.target.value })}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={() => handleAddMember(group.id)}>
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Recent Expenses */}
                  {groupExpenses.length > 0 && (
                    <div className="space-y-2 border-t border-border pt-3">
                      <Label className="text-sm">Recent Expenses</Label>
                      <div className="space-y-1">
                        {groupExpenses.slice(0, 3).map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground truncate">{expense.description}</span>
                            <span className="font-medium text-foreground">${expense.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
