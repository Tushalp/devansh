import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Add } from '../Authentications/Add'
import { Join } from '../Authentications/Join'

export const Addmember = () => {
  return (
    <div>
        
        <div className='chatpage_tab'>
       <Tabs variant='enclosed' className='Add_tab'>

               <TabList className='homebut'>
                    <Tab >Create room</Tab>
                    <Tab>Join room</Tab>
                </TabList>

                <TabPanels>
               
                 <TabPanel>
                    <Add/>
                  </TabPanel>

                 <TabPanel>
                    <Join/>
                  </TabPanel>

                </TabPanels>
            </Tabs>
       </div>
    </div>
  )
}
