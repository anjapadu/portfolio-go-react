package helpers

import "reflect"

func Map(slice interface{}, fn interface{}) interface{} {
	sliceValue := reflect.ValueOf(slice)
	fnValue := reflect.ValueOf(fn)

	// Ensure the provided slice is actually a slice
	if sliceValue.Kind() != reflect.Slice {
		panic("Map function expects a slice as the first argument")
	}

	// Ensure the provided function is a callable with one argument and one return value
	if fnValue.Kind() != reflect.Func || fnValue.Type().NumIn() != 1 || fnValue.Type().NumOut() != 1 {
		panic("Map function expects a function with one argument and one return value as the second argument")
	}

	// Create a new slice to store the transformed values
	result := reflect.MakeSlice(reflect.SliceOf(fnValue.Type().Out(0)), sliceValue.Len(), sliceValue.Len())

	// Iterate over the slice and apply the mapping function to each element
	for i := 0; i < sliceValue.Len(); i++ {
		element := sliceValue.Index(i)
		mapped := fnValue.Call([]reflect.Value{element})[0]
		result.Index(i).Set(mapped)
	}

	return result.Interface()
}
