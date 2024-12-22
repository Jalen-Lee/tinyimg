import { Dialog,Flex,Button } from '@radix-ui/themes'

export default function SettingPanel(){
  return (
  <Dialog.Root>
    <Dialog.Trigger>
      <Button>Edit profile</Button>
    </Dialog.Trigger>

    <Dialog.Content maxWidth="450px">
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        Make changes to your profile.
      </Dialog.Description>

      <Flex direction="column" gap="3">
        
      </Flex>

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button>Save</Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
  )
}