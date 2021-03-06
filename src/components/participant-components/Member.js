import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { IconContext } from 'react-icons'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { GiHighKick, GiChessKing } from 'react-icons/gi'

import api from '../../utilities/api'

const Wishes = () => {
  const reload = () => {
    window.location.reload(false)
  }

  return (
    <div className='unreg-event-details-container'>
      <div className='wishes-body'>
        <h1>
          Your wish has been fulfilled
        </h1>
        <button className='wish-reload' onClick={reload}>
          Reload
        </button>
      </div>
    </div>
  )
}

const Member = ({ event, member, isAdmin, isWaiting }) => {
  const [wishes, setWishes] = useState(false)
  const [ad, setAd] = useState(false)

  const addToTeam = async () => {
    const data = {
      waitingMemberAuthId: member.auth[0].authId,
      teamId: event.teamData.team.teamId
    }
    const token = sessionStorage.getItem('token')
    if (token === '') {
      console.log('Hacker?')
      return
    }
    const response = await api('addTeamMember', 'post', data, token, null)
    if (response.status === 200) {
      setWishes(() => true)
    }
  }

  const removeFromTeam = async () => {
    const selfAuth = sessionStorage.getItem('auth_id')
    if (selfAuth === '') {
      return
    }
    let data = {}
    let url = ''
    if (selfAuth === member.auth[0].authId) {
      data = {
        teamId: event.teamData.team.teamId
      }
      url = 'leaveTeam'
    } else {
      data = {
        memberAuthId: member.auth[0].authId,
        teamId: event.teamData.team.teamId
      }
      url = 'removeMember'
    }
    const token = sessionStorage.getItem('token')
    if (token === '') {
      console.log('Hacker?')
      return
    }
    const response = await api(url, 'post', data, token, null)

    if (response.status === 200) {
      setWishes(() => true)
    }
  }

  const hook = () => {
    const selfAuth = sessionStorage.getItem('auth_id')
    if (selfAuth === member.auth[0].authId) {
      setAd(() => true)
    }
  }

  useEffect(hook, [])

  return (
    <div>
      {isWaiting && (
        <IconContext.Provider value={{ color: '#fff', className: 'make-white' }}>
          <button title='Add to Team' onClick={addToTeam} className='add-to-team'> <AiOutlineUserAdd /> </button>
        </IconContext.Provider>
      )}
      {!isWaiting && (
        <button title='Future Endeavor' onClick={removeFromTeam} className='add-to-team'>
          <GiHighKick />
        </button>
      )}
      {member.auth[0].name}
      {ad && (
        <IconContext.Provider value={{ size: '1.4em' }}>
          <span className='leader-tag'>
            <GiChessKing />
          </span>
        </IconContext.Provider>
      )}
      {wishes && (
        <Wishes />
      )}
    </div>
  )
}

Member.propTypes = {
  member: PropTypes.object,
  isAdmin: PropTypes.bool,
  isWaiting: PropTypes.bool,
  event: PropTypes.object
}

export default Member
