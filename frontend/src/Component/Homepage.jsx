import { Center, Container } from '@chakra-ui/react'
import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Login } from '../Authentications/Login'
import { Signup } from '../Authentications/Signup'

export const Homepage = () => {
  return (
    <div className='homemain'>
        <Container maxW="xl" centerContent>
            <div className='homehading'>
                <h1>Talk-A-Tive</h1>
            </div>

            <div className='homelogin'>
            <Tabs variant='enclosed'>
                <TabList className='homebut'>
                    <Tab >Login</Tab>
                    <Tab>Sign up</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Login/>
                  </TabPanel>

                  <TabPanel>
                     <Signup/>
                  </TabPanel>
                </TabPanels>
            </Tabs>
            
            </div>
        </Container>
    </div>
  )
}
