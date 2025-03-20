import React from 'react'
import ContactType from './ContactType';
import Jobtitle from './Jobtitle';
import OutBy from './OutBy';
import TagGroup from './TagGroup';
import UserGroupType from './UserGroupType';
import State from './State';
import County from './County';

const Others = () => {
  return (
    <>
        {/* Main Content */}
        <div className="row mt-4">
            <ContactType/>
            <Jobtitle/>
            <OutBy/>
            <TagGroup/>
            <UserGroupType/>
            <State/>
            <County/>
          </div>
    </>
  )
}

export default Others;
