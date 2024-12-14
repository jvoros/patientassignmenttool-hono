<template>
  <Popover>
    <PopoverTrigger>
      <Button> <Icon icon="provider" />Add Provider</Button>
    </PopoverTrigger>
    <PopoverContent class="flex flex-col gap-2">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple"> Apple </SelectItem>
            <SelectItem value="apple"> Apple </SelectItem>
            <SelectItem value="apple"> Apple </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple"> Apple </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button>Add to Board</Button>
    </PopoverContent>
  </Popover>
</template>
