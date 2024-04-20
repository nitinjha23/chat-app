import { Box, Button, TabList, TabPanel, TabPanels, Tabs, useMultiStyleConfig, useTab } from '@chakra-ui/react'
import React from 'react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
const CustomTab1 = () => {
    const CustomTab = React.forwardRef((props, ref) => {
        // 1. Reuse the `useTab` hook
        const tabProps = useTab({ ...props, ref })
        const isSelected = !!tabProps['aria-selected']

        // 2. Hook into the Tabs `size`, `variant`, props
        const styles = useMultiStyleConfig('Tabs', tabProps)

        return (
            <Button __css={styles.tab} {...tabProps}>
                <Box as='span' mr='2'>
                    {isSelected ? '😎' : '😉'}
                </Box>
                {tabProps.children}
            </Button>
        )
    })


  return (
    <div>
          <Tabs>
              <TabList>
                  <CustomTab width="50%">Login</CustomTab>
                  <CustomTab width="50%">Sign-Up</CustomTab>
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
  )
}

export default CustomTab1
